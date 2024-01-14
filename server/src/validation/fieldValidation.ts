import { userModel } from '@/models';
import { body } from 'express-validator';

//
// username
//

export const username = () =>
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters');

export const usernameAndNotExists = () =>
  username()
    .bail()
    .custom(async (value) => {
      const isDuplicate = await userModel.exists({ username: value });
      if (isDuplicate) {
        throw new Error('Username already in use');
      }
      return true;
    });

//
// email
//

export const email = () =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail();

export const emailAndNotExists = () =>
  email()
    .bail()
    .custom(async (value) => {
      const isDuplicate = await userModel.exists({ email: value });
      if (isDuplicate) {
        throw new Error('Email already in use');
      }
      return true;
    });

//
// password
//

export const password = () =>
  body('password').trim().notEmpty().withMessage('Password must be provided');

export const newPassword = () =>
  body('password')
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be between 8 and 50 characters')
    .bail()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    );

export const confirmNewPassword = () =>
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    });

//
// profile
//

export const bio = () =>
  body('bio')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be longer than 500 characters');

export const location = () =>
  body('location')
    .trim()
    .isLength({ max: 150 })
    .withMessage('Location cannot be longer than 150 characters');
