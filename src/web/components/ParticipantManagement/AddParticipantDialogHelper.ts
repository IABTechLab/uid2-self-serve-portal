export const validateCrmAgreementNumber = (value: string): boolean | string => {
  const regex = /^\d{8}$/;
  return regex.test(value) ? true : 'Please enter an 8-digit number.';
};

export const validateEditCrmAgreementNumber = (
  value: string,
  initialValue: string | null
): boolean | string => {
  if (initialValue === null && value === null) return true;
  if (initialValue === '' && value === '') return true;

  const regex = /^\d{8}$/;
  return regex.test(value) ? true : 'Please enter an 8-digit number.';
};
