

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


};

export default initRoutes;
