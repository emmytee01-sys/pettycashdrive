import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', apiRoutes);

import { startReminderService } from './services/reminderService';

// Main Entry
const startServer = async () => {
    // Database check
    await connectDB();
    
    // Start Services
    startReminderService();

    // Default route
    app.get('/', (req, res) => {
        res.json({ message: 'PettyCash API is running 🚀' });
    });

    app.listen(port, () => {
        console.log(`🚀 PettyCash Server listening on http://localhost:${port}`);
    });
};

startServer().catch(err => {
    console.error('Fatal initialization error:', err);
});
