export default class CustomError extends Error {
  constructor(public message: string, public statusCode = 400) {
    super(message);
  }
}
