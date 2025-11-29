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

// app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server HTTPS berjalan di port ${PORT}`);
  console.log(`MongoDB Connected...`); 
});

MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    console.log(" MongoDB Lokal Terhubung...");

    const db = client.db('scanbar'); 
    
    app.locals.db = db; 
  
    app.use('/api/products', productRoutes);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));