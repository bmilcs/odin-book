export type ExpressValidatorError = {
  msg: string;
  path: string;
  type: string;
  value: string;
};

export const getFieldErrorMsg = (
  errors: ExpressValidatorError[],
  field: string,
) => {
  return errors.reduce((acc: string, cur: ExpressValidatorError) => {
    return cur.path === field ? cur.msg : acc;
  }, '');
};

export const getErrorMsg = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return error as string;
};
