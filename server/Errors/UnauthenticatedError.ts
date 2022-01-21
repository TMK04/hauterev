import NextError from "Errors/NextError";

export default class UnauthenticatedError extends NextError {
  constructor() {
    super(401, "Incorrect username or password");
  }
}
