import { authController } from '@/controllers';
import { ensureAuthenticated, handleValidationErrors } from '@/middleware';
import { validateLogin, validateSignup } from '@/validation';
import { Router } from 'express';

const authRouter = Router();

authRouter.get('/status', authController.status);

authRouter.post(
  '/signup',
  validateSignup,
  handleValidationErrors,
  authController.signup,
);

authRouter.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login,
);

authRouter.post('/logout', ensureAuthenticated, authController.logout);

export default authRouter;
