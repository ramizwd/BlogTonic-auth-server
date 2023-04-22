import {NextFunction, Request, Response} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {User} from '../../interfaces/User';
import {HTTP_STATUS_CODES} from '../../utils/constants';
import argon2 from 'argon2';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';

// Get all users from the database, except the password and isAdmin fields
const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().select('-password -isAdmin');

    if (!users) {
      next(new CustomError('Users not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS_CODES.OK).json(users);
  } catch (error) {
    next(error);
  }
};

// Get a specific user from the database, except the password and isAdmin fields
const getUser = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => error.msg)
        .join(', ');
      throw new CustomError(messages, HTTP_STATUS_CODES.NOT_FOUND);
    }

    const user = await userModel
      .findById(req.params.id)
      .select('-password -isAdmin');

    if (!user) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

// Create a new user in the database, and return the new user
const createUser = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => error.msg)
        .join(', ');
      throw new CustomError(messages, HTTP_STATUS_CODES.NOT_FOUND);
    }

    const user = req.body;
    const hashedPassword = await argon2.hash(user.password);

    const userToCreate = {
      username: user.username,
      email: user.email,
      password: hashedPassword,
    };

    const newUser = await userModel.create(userToCreate);

    const userRes = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    const response: DBMessageResponse = {
      message: 'User created',
      user: userRes,
    };

    res.status(HTTP_STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

export {getUsers, getUser, createUser};
