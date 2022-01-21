import NextError from "Errors/NextError";

export default class InvalidError extends NextError {
  constructor(param: string) {
    super(400, `Invalid ${param}`);
  }
}
