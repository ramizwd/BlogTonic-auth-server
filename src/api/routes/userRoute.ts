import express from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {param, body} from 'express-validator';
import {authorize} from '../../middlewares/authorize';

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
  )
  .put(
    authorize,
    body('username')
      .optional()
      .isAlphanumeric()
      .withMessage('Username can only contain alphanumeric characters')
      .isLength({min: 3, max: 20})
      .withMessage('Username must be between 3 and 20 characters long')
      .trim()
      .escape(),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .optional()
      .isLength({min: 6})
      .withMessage('Password must be at least 6 characters long')
      .trim()
      .escape(),
    updateUser
  )
  .delete(authorize, deleteUser);

// Define the routes for a specific user
router.route('/:id').get(param('id').isNumeric(), getUser);

export default router;
