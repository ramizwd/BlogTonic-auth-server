import {NextFunction, Request, Response} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {User} from '../../interfaces/User';
import {HTTP_STATUS_CODES} from '../../utils/constants';
import argon2 from 'argon2';
import DBMessageResponse from '../../interfaces/DBMessageResponse';

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

const getUser = async (
  {params: {id}}: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(id).select('-password -isAdmin');

    if (!user) {
      next(new CustomError('User not found', HTTP_STATUS_CODES.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (
  {body}: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = body;
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
