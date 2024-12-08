import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true
}));
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, {
        body: req.body,
        query: req.query,
        params: req.params
    });
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.url);
    res.status(404).json({ 
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`Chat endpoint: http://localhost:${PORT}/api/chat/chat`);
    console.log('=================================');
}); 