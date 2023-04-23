import express from 'express';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import MessageResponse from '../interfaces/MessageResponse';

const router = express.Router();

// Define the route handler for the root path
router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'Routes: users, auth',
  });
});

// Mount the user route
router.use('/users', userRoute);
router.use('/auth', authRoute);

export default router;
