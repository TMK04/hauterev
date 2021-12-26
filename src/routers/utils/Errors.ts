import NextError from "NextError";

const capitalize = (s: string) => s.charAt(0).toUpperCase().concat(s.slice(1));

export class NotFoundError extends NextError {
  constructor(type: string, identifier: string) {
    super(404, `${capitalize(type)} ${identifier} not found`);
  }
}

export class InvalidError extends NextError {
  constructor(param: string) {
    super(400, `Invalid ${param}`);
  }
}

export class UnauthenticatedError extends NextError {
  constructor() {
    super(401, "Invalid username or password");
  }
}

export class UnauthorizedError extends NextError {
  constructor(message: string) {
    super(403, message);
  }
}
