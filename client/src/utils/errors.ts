import { TExpressValidatorError } from '@/utils/types';

export const getFieldErrorMsg = (
  errors: TExpressValidatorError[],
  field: string,
) => {
  return errors.reduce((acc: string, cur: TExpressValidatorError) => {
    return cur.path === field ? cur.msg : acc;
  }, '');
};

export const getErrorMsg = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return error as string;
};
