import { NextFunction, Request, Response } from 'express';

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// This is a utility function that wraps a controller function
// and handles any errors that it throws.

const tryCatch =
  (controller: Controller) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the controller function and pass it the request, response, and
      // next function.
      await controller(req, res, next);
    } catch (error) {
      // Call the next function and pass it the error.
      next(error);
    }
  };

export default tryCatch;
