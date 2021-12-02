import NextError from "NextError";

export class NotFoundError extends NextError {
  constructor(type: string, identifier: string) {
    super(404, `${type} ${identifier} not found`);
  }
}

export class InvalidError extends NextError {
  constructor(param: string) {
    super(400, `Invalid ${param}`);
  }
}

export class UnauthenticatedError extends NextError {
  constructor() {
    super(401, "Incorrect username or password");
  }
}

export class UnauthorizedError extends NextError {
  constructor(message: string) {
    super(403, message);
  }
}
