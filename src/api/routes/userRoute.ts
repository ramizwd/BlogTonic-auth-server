import express from 'express';
import {createUser, getUsers, getUser} from '../controllers/userController';
import {param, body} from 'express-validator';

const router = express.Router();

// Define the routes for users
router
  .route('/')
  .get(getUsers)
  .post(
    body('username')
      .isAlphanumeric()
      .withMessage('Username can only contain alphanumeric characters')
      .isLength({min: 3, max: 20})
      .withMessage('Username must be between 3 and 20 characters long')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .isLength({min: 6})
      .withMessage('Password must be at least 6 characters long')
      .trim()
      .escape(),
    createUser
  );

// Define the routes for a specific user
router.route('/:id').get(param('id').isNumeric(), getUser);

export default router;
