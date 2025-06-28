

// Import routes
import authRoutes from './auth.js';
// import userRoutes from './users.js';
// import applicationRoutes from './applicationRoutes.js';
// import documentRoutes from './documents.js';

const initRoutes = (app) => {
    // API Routes
    app.use('/api/auth', authRoutes);
    
    // app.use('/api/users', userRoutes);
    // app.use('/api/applications', applicationRoutes);
    // app.use('/api/documents', documentRoutes);
    
    // Root route
    app.get("/", (req, res) => {
        res.json({
            message: "Welcome to Fanbase AI Developers Portal"
        });
    });

    // 404 handler
    app.use("*", (req, res) => {
        res.status(404).json({
            status: 404,
            message: `Cannot ${req.method} ${req.originalUrl}`
        });
    });
};

export default initRoutes;
