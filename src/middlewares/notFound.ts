import {NextFunction, Request, Response} from 'express';
import CustomError from '../classes/CustomError';
import {HTTP_STATUS_CODES} from '../utils/constants';

// Handles 404 errors
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(
    new CustomError(
      `Not Found - ${req.originalUrl}`,
      HTTP_STATUS_CODES.NOT_FOUND
    )
  );
};
