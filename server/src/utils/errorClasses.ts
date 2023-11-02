export class AppError extends Error {
  public readonly statusCode: number;
  public readonly name: string;

  constructor(
    message = 'Something went wrong.',
    statusCode = 400,
    name = 'AppError',
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  public readonly errorArray: any[];

  constructor(
    errorArray: any[],
    statusCode = 400,
    message = 'Validation Error',
  ) {
    super(message, statusCode, 'ValidationError');
    this.errorArray = errorArray;
  }
}
