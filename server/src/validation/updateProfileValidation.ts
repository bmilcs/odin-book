import { validateField } from '@/validation';

const validateUpdateProfile = [
  validateField.username(),
  validateField.email(),
  validateField.bio(),
  validateField.location(),
];

export default validateUpdateProfile;
