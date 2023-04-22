import express from 'express';
import {createUser, getUsers, getUser} from '../controllers/userController';

const router = express.Router();

// Define the routes for users
router.route('/').get(getUsers).post(createUser);

// Define the routes for a specific user
router.route('/:id').get(getUser);

export default router;
