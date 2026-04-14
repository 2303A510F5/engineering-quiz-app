const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { seedQuestions } = require('./mockData');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;

const fs = require('fs');

const startServer = async () => {
  try {
    if (!fs.existsSync('./mongo_db_data')) {
      fs.mkdirSync('./mongo_db_data');
    }
    
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: './mongo_db_data',
        storageEngine: 'wiredTiger'
      }
    });

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to local MongoDB at ${uri}`);

    // Seed questions for the app to function properly
    await seedQuestions();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server', err);
  }
};

startServer();
