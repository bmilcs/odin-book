import { validateField } from '@/validation';

const validateLogin = [validateField.email(), validateField.password()];

export default validateLogin;
