const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');
const favoritesRouter = require('./routes/favorites');
const https = require('https');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const productRoutes = require('./routes/products');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

// Arahkan semua permintaan ke /api/users ke "loket" users.js
app.use('/api/foods', require('./routes/foods')); 
app.use('/api/articles', articleRoutes);
app.use('/api/favorites', favoritesRouter);
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
const keyPath = 'C:\\Users\\Administrator\\.vite-plugin-mkcert\\dev.pem';
const certPath = 'C:\\Users\\Administrator\\.vite-plugin-mkcert\\cert.pem';

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

// Helper: try to extract certificate info (subject, issuer, validity, SANs)
const { execFileSync } = require('child_process');
function getCertificateInfo(pemPath) {
  try {
    const { X509Certificate } = require('crypto');
    const pem = fs.readFileSync(pemPath);
    const x509 = new X509Certificate(pem);
    // Some Node versions expose subjectAltName via `subjectAltName` or `altNames`; try common fields
    const info = {
      subject: x509.subject || null,
      issuer: x509.issuer || null,
      validFrom: x509.validFrom || null,
      validTo: x509.validTo || null,
      subjectAltName: x509.subjectAltName || x509.altNames || null
    };
    return { ok: true, info };
  } catch (e) {
    // Fallback: try to use openssl if available to read SANs
    try {
      const out = execFileSync('openssl', ['x509', '-in', pemPath, '-noout', '-text'], { encoding: 'utf8' });
      const sanMatch = out.match(/X509v3 Subject Alternative Name:\s*\n\s*([^\n]+)/i);
      const subject = out.match(/Subject:\s*([^\n]+)/i)?.[1] || null;
      const issuer = out.match(/Issuer:\s*([^\n]+)/i)?.[1] || null;
      const validFrom = out.match(/Not Before:\s*([^\n]+)/i)?.[1] || null;
      const validTo = out.match(/Not After :\s*([^\n]+)/i)?.[1] || out.match(/Not After:\s*([^\n]+)/i)?.[1] || null;
      return { ok: true, info: { subject, issuer, validFrom, validTo, subjectAltName: sanMatch ? sanMatch[1].trim() : null } };
    } catch (e2) {
      return { ok: false, error: `Unable to parse certificate: ${e.message}; fallback error: ${e2.message}` };
    }
  }
}


// Start HTTPS server only after MongoDB connection is ready
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {

    const db = client.db('Scanbar');
    app.locals.db = db;

    app.use('/api/products', productRoutes);

    // Print startup info about HTTPS and certificate (helpful for debugging mkcert)
    try {
      console.log('Starting HTTPS server...');
      console.log('  Listening on:', `https://0.0.0.0:${PORT}`);
      console.log('  Key path:', keyPath, 'exists=', fs.existsSync(keyPath));
      console.log('  Cert path:', certPath, 'exists=', fs.existsSync(certPath));

      const certResult = getCertificateInfo(certPath);
      if (certResult.ok) {
        console.log('  Certificate subject:', certResult.info.subject);
        console.log('  Certificate issuer :', certResult.info.issuer);
        console.log('  Valid from         :', certResult.info.validFrom);
        console.log('  Valid to           :', certResult.info.validTo);
        console.log('  SubjectAltName     :', certResult.info.subjectAltName || certResult.info.subjectAltName === null ? certResult.info.subjectAltName : '(none)');
      } else {
        console.warn('  Certificate info: could not parse certificate.', certResult.error);
        console.warn('  If needed, run `openssl x509 -in "' + certPath + '" -text -noout` to inspect SANs.');
      }
    } catch (logErr) {
      console.warn('Failed to log certificate info:', logErr);
    }

    // Create and start HTTPS server after DB is connected
    // Use a resilient starter that will try next ports when EADDRINUSE occurs
    function startHttpsServer(startPort, host = '0.0.0.0', maxAttempts = 10) {
      let attempt = 0;

      const tryListen = (port) => {
        const server = https.createServer(httpsOptions, app);

        server.on('error', (err) => {
          if (err && err.code === 'EADDRINUSE' && attempt < maxAttempts) {
            console.warn(`Port ${port} in use, trying ${port + 1} (attempt ${attempt + 1}/${maxAttempts})`);
            attempt += 1;
            setTimeout(() => tryListen(port + 1), 300);
          } else {
            console.error('Failed to start HTTPS server:', err);
            // If we can't recover, exit with non-zero so process managers notice
            process.exit(1);
          }
        });

        server.listen(port, host, () => {
          console.log(`Server HTTPS berjalan di port ${port}`);
          console.log(`MongoDB Connected...`);
        });
      };

      // Ensure numeric port
      const p = parseInt(startPort, 10) || 3000;
      tryListen(p);
    }

    startHttpsServer(PORT);
  })
  .catch(err => {
    console.error('Gagal koneksi ke MongoDB:', err);
   
  });