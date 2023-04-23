import {NextFunction, Request, Response} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {User} from '../../interfaces/User';
import {HTTP_STATUS_CODES} from '../../utils/constants';
import argon2 from 'argon2';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import {UserOutput} from '../../interfaces/User';

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
    const password = await argon2.hash(user.password);

    const userToCreate = {
      ...user,
      password,
    };

    const newUser = await userModel.create(userToCreate);

    const {_id: id, username, email} = newUser;

    const response: DBMessageResponse = {
      message: 'User created',
      user: {id, username, email},
    };

    res.status(HTTP_STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(new CustomError('Duplicate entry', HTTP_STATUS_CODES.OK));
  }
};

// Update a user in the database, and return the updated user
const updateUser = async (
  req: Request<{}, {}, User>,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    const user = req.body;
    const {user: loggedInUser} = res.locals;

    const password = user.password
      ? await argon2.hash(user.password)
      : undefined;

    const userToUpdate = {
      ...user,
      password,
    };

    const updatedUser = await userModel
      .findByIdAndUpdate(loggedInUser.id, userToUpdate, {new: true})
      .select('-password -isAdmin');

    if (!updatedUser) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    const {_id: id, username, email} = updatedUser;

    const response: DBMessageResponse = {
      message: 'User updated',
      user: {id, username, email},
    };

    res.status(HTTP_STATUS_CODES.OK).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete a user from the database, and return the deleted user
const deleteUser = async (
  _req: Request,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    const {user: loggedInUser} = res.locals;

    const deletedUser = await userModel.findByIdAndDelete(loggedInUser.id);

    if (!deletedUser) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    const {_id: id, username, email} = deletedUser;

    const response: DBMessageResponse = {
      message: 'User deleted',
      user: {id, username, email},
    };

    res.status(HTTP_STATUS_CODES.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export {getUsers, getUser, createUser, updateUser, deleteUser};
