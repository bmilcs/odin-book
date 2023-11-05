import { validateField } from '@/validation';

const validateSignup = [
  validateField.usernameAndNotExists(),
  validateField.emailAndNotExists(),
  validateField.newPassword(),
  validateField.confirmNewPassword(),
];

export default validateSignup;
