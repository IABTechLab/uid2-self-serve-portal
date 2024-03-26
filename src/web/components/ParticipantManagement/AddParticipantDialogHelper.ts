export const validateSalesforceAgreementNumber = (value: string): boolean | string => {
  const regex = /^\d{8}$/;
  return regex.test(value) ? true : 'Please enter an 8-digit number.';
};
