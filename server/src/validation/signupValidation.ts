import { validateField } from '@/validation';

const validateSignup = [
  validateField.username(),
  validateField.email(),
  validateField.password(),
  validateField.confirmPassword(),
];

export default validateSignup;
