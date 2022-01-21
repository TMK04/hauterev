import NextError from "Errors/NextError";

export default class NotFoundError extends NextError {
  constructor(type: string, identifier: string) {
    super(404, `${type} ${identifier} not found`);
  }
}
