import { validateSalesforceAgreementNumber } from './AddParticipantDialogHelper';

describe('#validateSalesforceAgreementNumber', () => {
  test('returns true for valid 8-digit number', () => {
    const validNumber = '12345678';
    expect(validateSalesforceAgreementNumber(validNumber)).toBe(true);
  });

  test('returns error message for less than 8 digits', () => {
    const lessThanEightDigits = '1234567';
    expect(validateSalesforceAgreementNumber(lessThanEightDigits)).toBe(
      'Please enter an 8-digit number.'
    );
  });

  test('returns error message for more than 8 digits', () => {
    const moreThanEightDigits = '123456789';
    expect(validateSalesforceAgreementNumber(moreThanEightDigits)).toBe(
      'Please enter an 8-digit number.'
    );
  });

  test('returns error message for non-numeric input', () => {
    const nonNumericInput = 'abc';
    expect(validateSalesforceAgreementNumber(nonNumericInput)).toBe(
      'Please enter an 8-digit number.'
    );
  });
});
