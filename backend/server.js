const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);

app.get('/', (req, res) => {
    res.send('Server is running properly');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
    });