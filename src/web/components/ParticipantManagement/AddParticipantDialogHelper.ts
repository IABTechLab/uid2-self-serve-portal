export const validatecrmAgreementNumber = (value: string): boolean | string => {
  const regex = /^\d{8}$/;
  return regex.test(value) ? true : 'Please enter an 8-digit number.';
};
