import NextError from "Errors/NextError";

export default class UnauthorizedError extends NextError {
  constructor(message: string) {
    super(403, message);
  }
}
