import { NextFunction, Request, Response } from 'express';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

const responseMethods = (req: Request, res: Response, next: NextFunction) => {
  res.success = (message: string, data?: any, statusCode = 200) => {
    const response: ApiResponse = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  };

  res.error = (message: string, error?: any, statusCode = 500) => {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    res.status(statusCode).json(response);
  };

  next();
};

export default responseMethods;
