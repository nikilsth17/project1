// phoneNumberValidation.js

// Regular expression for a simple phone number validation (10 digits)
const phoneNumberPattern = /^[0-9]{10}$/;

// Validation function
export const isValidPhoneNumber = (phoneNumber) => {
  return phoneNumberPattern.test(phoneNumber);
};
