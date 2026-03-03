/**
 * Auth and form validators (signup, login).
 * XSS: we escape/trim in authService when storing; inputs are trimmed before validation.
 */

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, message: 'Email is required' };
  if (!EMAIL_REGEX.test(trimmed))
    return { valid: false, message: 'Enter a valid email address' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8)
    return { valid: false, message: 'Password must be at least 8 characters' };
  if (!PASSWORD_REGEX.test(password))
    return {
      valid: false,
      message:
        'Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character (@$!%*?&)',
    };
  return { valid: true };
}

export function validateFullName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, message: 'Full name is required' };
  if (trimmed.length < 3)
    return { valid: false, message: 'Full name must be at least 3 characters' };
  return { valid: true };
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): ValidationResult {
  if (!confirm) return { valid: false, message: 'Please confirm password' };
  if (password !== confirm)
    return { valid: false, message: 'Passwords do not match' };
  return { valid: true };
}

/** Sanitize for display/storage: trim and strip script-like content */
export function sanitizeInput(value: string): string {
  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
