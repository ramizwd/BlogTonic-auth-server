import {HTTP_STATUS_CODES} from '../utils/constants';

export default class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode = HTTP_STATUS_CODES.BAD_REQUEST
  ) {
    super(message);
  }
}
