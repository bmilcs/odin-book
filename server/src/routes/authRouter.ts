import { authController } from '@/controllers';
import { handleValidationErrors } from '@/middleware';
import { validateSignup } from '@/validation';
import { Router } from 'express';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateSignup,
  handleValidationErrors,
  authController.signup,
);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

export default authRouter;
