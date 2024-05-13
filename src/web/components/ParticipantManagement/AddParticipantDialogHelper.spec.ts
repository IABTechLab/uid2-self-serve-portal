import { validateCrmAgreementNumber } from './AddParticipantDialogHelper';

describe('#validatecrmAgreementNumber', () => {
  test('returns true for valid 8-digit number', () => {
    const validNumber = '12345678';
    expect(validateCrmAgreementNumber(validNumber)).toBe(true);
  });

  test('returns error message for less than 8 digits', () => {
    const lessThanEightDigits = '1234567';
    expect(validateCrmAgreementNumber(lessThanEightDigits)).toBe('Please enter an 8-digit number.');
  });

  test('returns error message for more than 8 digits', () => {
    const moreThanEightDigits = '123456789';
    expect(validateCrmAgreementNumber(moreThanEightDigits)).toBe('Please enter an 8-digit number.');
  });

  test('returns error message for non-numeric input', () => {
    const nonNumericInput = 'abc';
    expect(validateCrmAgreementNumber(nonNumericInput)).toBe('Please enter an 8-digit number.');
  });
});
