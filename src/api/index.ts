import express from 'express';
import userRoute from './routes/userRoute';
import MessageResponse from '../interfaces/MessageResponse';

const router = express.Router();

// Define the route handler for the root path
router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'routes: users',
  });
});

// Mount the user route
router.use('/users', userRoute);

export default router;
