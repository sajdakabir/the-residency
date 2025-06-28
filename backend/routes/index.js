// Import routes
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import kycRoutes from './kyc.js';
import residencyRoutes from './residency.js';
import vcRoutes from './vc.js';
import companyRoutes from './company.js';
import {protect} from '../middleware/auth.js';
// import userRoutes from './users.js';
// import applicationRoutes from './applicationRoutes.js';
// import documentRoutes from './documents.js';

const initRoutes = (app) => {
    // API Routes
    app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
    
      // KYC
  app.use('/api/kyc', kycRoutes);
  
  // Residency/NFT
  app.use('/api/residency', residencyRoutes);
    
    // Verifiable Credentials
    app.use('/api/vc', vcRoutes);
    
    // Company/Entity Registration
    app.use('/api/company', companyRoutes);
    
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
