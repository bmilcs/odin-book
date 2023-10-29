import AppError from '@/utils/AppError';

class ValidationError extends AppError {
  public readonly errorArray: any[];

  constructor(errorArray: any[], statusCode = 400, name = 'ValidationError') {
    super('Validation Error', statusCode, name);
    this.errorArray = errorArray;
  }
}

export default ValidationError;
