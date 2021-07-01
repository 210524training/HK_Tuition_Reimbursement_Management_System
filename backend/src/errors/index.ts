/* eslint-disable max-classes-per-file */
export class UserNotFoundError extends Error {
  constructor(m?: string) {
    super(m);

    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class WrongUserNameError extends Error {
  constructor(m?: string) {
    super(m);

    Object.setPrototypeOf(this, WrongUserNameError.prototype);
  }
}

export class UserNotAddedError extends Error {
  constructor(m?: string) {
    super(m);
    Object.setPrototypeOf(this, UserNotAddedError.prototype);
  }
}
