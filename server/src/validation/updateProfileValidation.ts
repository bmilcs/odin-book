import { validateField } from '@/validation';

const validateUpdateProfile = [
  validateField.usernameChange(),
  validateField.emailChange(),
  validateField.bio(),
  validateField.location(),
];

export default validateUpdateProfile;
