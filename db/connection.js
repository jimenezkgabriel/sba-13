const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection;
        db.on('error', (error) => console.error('Connection error:', error));
        db.on('open', () => console.log('Connected to MongoDB'));
        db.on('disconnected', () => console.log('Disconnected from MongoDB'));
    }
    catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDb;