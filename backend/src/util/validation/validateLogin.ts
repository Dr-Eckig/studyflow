/**
 * @module LoginValidation
 *
 * Validates login input fields.
 * Checks for valid email format and non-empty password.
 */

import { Login } from "../../models/user.js";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;

/**
 * Validates the login credentials input.
 *
 * @function
 * @param {Partial<Login>} login - Partial login object containing email and/or password
 * @returns {{ valid: boolean; status: number; message?: string }}
 *   Validation result:
 *   - valid: indicates if the input is valid
 *   - status: HTTP status code to respond with if invalid
 *   - message: optional error message when invalid
 */
export function validateLoginInput(login: Partial<Login>): {
  valid: boolean;
  status: number;
  message?: string;
} {
  const email = login.email;
  const password = login.password;

  if (email !== undefined) {
    if (!email || !emailRegex.test(email)) {
      return {
        valid: false,
        status: 400,
        message: "A valid email address is required.",
      };
    }
  }

  if (password !== undefined) {
    if (!password?.trim()) {
      return {
        valid: false,
        status: 400,
        message: `Password must not be empty`,
      };
    }
  }

  return { valid: true, status: 200 };
}
