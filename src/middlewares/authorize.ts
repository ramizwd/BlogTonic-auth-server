import {NextFunction, Request, Response} from 'express';
import CustomError from '../classes/CustomError';
import {HTTP_STATUS_CODES} from '../utils/constants';
import jwt from 'jsonwebtoken';
import {UserOutput} from '../interfaces/User';
import userModel from '../api/models/userModel';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not defined');
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      throw new CustomError(
        'Token not provided',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      throw new CustomError(
        'Token not provided',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const loggedInUser = jwt.verify(token, JWT_SECRET) as UserOutput;

    const user = await userModel.findById(loggedInUser.id).select('-password');

    if (!user) {
      throw new CustomError('Token not valid', HTTP_STATUS_CODES.FORBIDDEN);
    }

    const userOutput: UserOutput = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    res.locals.user = userOutput;

    next();
  } catch (error) {
    next(error);
  }
};
