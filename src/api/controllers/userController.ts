import {NextFunction, Request, Response} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {User} from '../../interfaces/User';
import {HTTP_STATUS_CODES} from '../../utils/constants';
import bcrypt from 'bcryptjs';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import {UserOutput} from '../../interfaces/User';

const salt = bcrypt.genSaltSync(10);

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
    const password = await bcrypt.hash(user.password, salt);

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
      ? await bcrypt.hash(user.password, salt)
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

// Update user as admin
const updateUserAsAdmin = async (
  req: Request<{id: string}, {}, User>,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user.isAdmin) {
      next(
        new CustomError(
          'Not authorized to update user',
          HTTP_STATUS_CODES.UNAUTHORIZED
        )
      );
      return;
    }

    let password = '';
    const user = req.body;

    const userToUpdateId = req.params.id;

    if (user.password) {
      password = await bcrypt.hash(user.password, salt);
    }

    const userToUpdate = {
      ...user,
      password,
    };

    const updatedUser = await userModel
      .findByIdAndUpdate(userToUpdateId, userToUpdate, {
        new: true,
      })
      .select('-password -isAdmin');

    if (!updatedUser) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    const {_id: userId, username, email} = updatedUser;

    const response: DBMessageResponse = {
      message: 'User updated',
      user: {id: userId, username, email},
    };

    res.status(HTTP_STATUS_CODES.OK).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete user as admin
const deleteUserAsAdmin = async (
  req: Request,
  res: Response<{}, {user: UserOutput}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user.isAdmin) {
      next(
        new CustomError(
          'You are not authorized to delete user',
          HTTP_STATUS_CODES.UNAUTHORIZED
        )
      );
    }

    const deleteUser = await userModel.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    const {_id: id, username, email} = deleteUser;

    const response: DBMessageResponse = {
      message: 'User deleted',
      user: {id, username, email},
    };

    res.status(HTTP_STATUS_CODES.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
  deleteUserAsAdmin,
};
