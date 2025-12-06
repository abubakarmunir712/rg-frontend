export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a research domain input
 * Requirements: 1.1, 1.2
 * - Must be at least 3 characters long
 * - Must not contain special symbols (only letters, numbers, spaces, and hyphens allowed)
 */
export function validateDomain(domain: string): ValidationResult {
  // Check minimum length (Requirement 1.1)
  if (domain.length < 3) {
    return {
      isValid: false,
      error: 'Domain must be at least 3 characters long',
    };
  }

  // Check for special symbols (Requirement 1.2)
  // Allow letters, numbers, spaces, and hyphens only
  const validPattern = /^[a-zA-Z0-9\s-]+$/;
  if (!validPattern.test(domain)) {
    return {
      isValid: false,
      error: 'Domain must not contain special symbols',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  return {
    isValid: true,
  };
}
