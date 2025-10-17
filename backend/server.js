const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Arahkan semua permintaan ke /api/users ke "loket" users.js
app.use('/api/users', require('./routes/users'));
app.use('/api/foods', require('./routes/foods')); 

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));