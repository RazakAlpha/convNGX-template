import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  if (isValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    return null;
  }

  const errors: any = {};

  if (!isValidLength) {
    errors.minLength = true;
  }
  if (!hasUpperCase) {
    errors.noUpperCase = true;
  }
  if (!hasLowerCase) {
    errors.noLowerCase = true;
  }
  if (!hasNumber) {
    errors.noNumber = true;
  }
  if (!hasSpecialChar) {
    errors.noSpecialChar = true;
  }

  return errors;
};

export const matchingFieldsValidator = (controlName: string, matchingControlName: string) => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
};

export const emailPatternValidator = (pattern?: RegExp): ValidatorFn => {
  const emailRegex =
    pattern ||
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return emailRegex.test(value) ? null : { invalidEmail: true };
  };
};

export const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
};

export const trimValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value && typeof value === 'string' && value !== value.trim()) {
    return { trim: true };
  }
  return null;
};
