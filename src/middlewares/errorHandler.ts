import {NextFunction, Request, Response} from 'express';
import CustomError from '../classes/CustomError';
import ErrorResponse from '../interfaces/ErrorResponse';
import {HTTP_STATUS_CODES} from '../utils/constants';

// Handles errors in the middleware pipeline
export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  res.status(err.statusCode ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
