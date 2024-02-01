import { userModel } from '@/models';
import { body } from 'express-validator';

//
// username
//

export const username = () =>
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .bail()
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Username can only contain letters, numbers, and spaces');

export const usernameAndNotExists = () =>
  username()
    .bail()
    .custom(async (value) => {
      const isDuplicateUsername = await userModel.exists({
        username: { $regex: new RegExp(`^${value}$`, 'i') },
      });

      if (isDuplicateUsername) {
        throw new Error('Username already in use');
      }

      return true;
    });

export const usernameChange = () =>
  username()
    .bail()
    .custom(async (value, { req }) => {
      const { userId } = req;
      const { username: originalUsername } = req.params || {};
      const usernameNewValue = value;

      const { username: requestingUsername } = await userModel.findById(
        userId,
        { username: 1 },
      );

      const isProfileOwner = requestingUsername === originalUsername;
      if (!isProfileOwner) {
        throw new Error('You are not the owner of this profile');
      }

      const usernameChangeRequested = requestingUsername !== usernameNewValue;
      if (!usernameChangeRequested) {
        return true;
      }

      const isDuplicateUsername = await userModel
        .exists({
          username: usernameNewValue,
        })
        .collation({ locale: 'en', strength: 2 });

      if (isDuplicateUsername) {
        throw new Error('Username already in use');
      }

      // username has changed & is not taken
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
      const isDuplicateEmail = await userModel
        .exists({ email: value })
        .collation({
          locale: 'en',
          strength: 2,
        });

      if (isDuplicateEmail) {
        throw new Error('Email already in use');
      }

      return true;
    });

export const emailChange = () =>
  email()
    .bail()
    .custom(async (value, { req }) => {
      const { userId } = req;
      const emailNewValue = value;

      const { email: requestingUsersEmail } = await userModel.findById(userId, {
        email: 1,
      });

      const emailChangeRequested = requestingUsersEmail !== emailNewValue;
      if (!emailChangeRequested) {
        return true;
      }

      const isDuplicateEmail = await userModel
        .exists({ email: emailNewValue })
        .collation({ locale: 'en', strength: 2 });

      if (isDuplicateEmail) {
        throw new Error('Email already in use');
      }

      // email has changed & is not taken
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
// profile update
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
