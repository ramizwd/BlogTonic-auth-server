import express from 'express';
import {login} from '../controllers/authController';

const router = express.Router();

// Defines the route for user authentication
router.post('/login', login);

export default router;
