import {NextFunction, Request, Response} from 'express';
import CustomError from '../classes/CustomError';

// Handles 404 errors
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new CustomError(`Not Found - ${req.originalUrl}`, 404));
};
