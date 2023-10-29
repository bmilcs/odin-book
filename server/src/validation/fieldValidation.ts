import { body } from 'express-validator';

export const username = () => body('userName').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters');

export const email = () => body('email').trim().isEmail().withMessage('Email must be valid');

export const password = () => body('password').trim().isLength({ min: 8, max: 50 }).withMessage('Password must be between 8 and 50 characters');

export const confirmPassword = () =>
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    });
