import { userModel } from '@/models';
import { body } from 'express-validator';

export const username = () =>
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters');

export const usernameWithDuplicateCheck = () =>
  username()
    .bail()
    .custom(async (value) => {
      const isDuplicate = await userModel.exists({ username: value });
      if (isDuplicate) {
        throw new Error('Username already in use');
      }
      return true;
    });

export const email = () =>
  body('email').trim().isEmail().withMessage('Email must be valid');

export const emailWithDuplicateCheck = () =>
  email()
    .bail()
    .custom(async (value) => {
      const isDuplicate = await userModel.exists({ email: value });
      if (isDuplicate) {
        throw new Error('Email already in use');
      }
      return true;
    });

export const password = () =>
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

export const confirmPassword = () =>
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    });
