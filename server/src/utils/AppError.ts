class AppError extends Error {
  public readonly statusCode: number;

  constructor(message = 'Something went wrong.', statusCode = 400, name = 'AppError') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export default AppError;
