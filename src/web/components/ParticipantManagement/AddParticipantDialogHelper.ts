export const validatecrmAgreementNumber = (value: string): boolean | string => {
  if (value === '') return true;

  const regex = /^\d{8}$/;
  return regex.test(value) ? true : 'Please enter an 8-digit number.';
};
