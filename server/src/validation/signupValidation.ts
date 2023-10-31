import { validateField } from '@/validation';

const validateSignup = [
  validateField.usernameWithDuplicateCheck(),
  validateField.emailWithDuplicateCheck(),
  validateField.password(),
  validateField.confirmPassword(),
];

export default validateSignup;
