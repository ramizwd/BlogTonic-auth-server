import {NextFunction, Request, Response} from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import {HTTP_STATUS_CODES} from '../../utils/constants';
import {UserOutput} from '../../interfaces/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not defined');
}

// Handles user login by validating credentials and returns user info and a token
const login = async (
  req: Request<{}, {}, {username: string; password: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {username, password} = req.body;

    const user = await userModel.findOne({email: username});
    if (!user) {
      throw new CustomError('Invalid credentials', HTTP_STATUS_CODES.OK);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new CustomError('Invalid credentials', HTTP_STATUS_CODES.OK);
    }

    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, JWT_SECRET);

    const userOutput: UserOutput = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const message: LoginMessageResponse = {
      message: 'Login successful',
      token,
      user: userOutput,
    };

    res.status(HTTP_STATUS_CODES.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export {login};
