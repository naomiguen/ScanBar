const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');
const favoritesRouter = require('./routes/favorites');
const { MongoClient } = require('mongodb');
const productRoutes = require('./routes/products');
const chatbotRoutes = require('./routes/chatbot');

dotenv.config();
connectDB();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: '*',
    credentials: true
}));

// API Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/foods', require('./routes/foods')); 
app.use('/api/articles', articleRoutes);
app.use('/api/favorites', favoritesRouter);
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Port configuration for deployment
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

// Start server only after MongoDB connection is ready
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    const db = client.db('Scanbar');
    app.locals.db = db;
    app.use('/api/products', productRoutes);

    // Start HTTP server (cloud provider handles HTTPS/SSL)
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(`MongoDB Connected...`);
    });
  })
  .catch(err => {
    console.error('Gagal koneksi ke MongoDB:', err);
    process.exit(1);
  });