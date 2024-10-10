export class UnknownException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownError';
  }
}

export class UnAuothorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnAuthorizedError';
  }
}
