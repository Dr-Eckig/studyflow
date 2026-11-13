/**
 * @module UserValidation
 *
 * Provides functions to prepare user context and validate user input data.
 * Includes checks for existing users, email uniqueness, valid languages, and boolean flags.
 */

import { getUser, getUserByEmail } from "../../db/user.js";
import { User } from "../../models/user.js";

const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

/**
 * Loads the context for a user by userId and optionally verifies email uniqueness.
 * Checks if the user exists and if the given email is already taken by another user.
 *
 * @param {string | undefined} userId - The ID of the user
 * @param {string} [email] - Optional email to check for uniqueness
 * @returns {Promise<{existingUser?: User; error?: {status: number; message: string}}>}
 *          Returns the existing user data or an error object if user is not found or email conflict occurs.
 */
export async function prepareUserContext(
  userId: string | undefined,
  email?: string
): Promise<{
  existingUser?: User;
  error?: { status: number; message: string };
}> {
  if (!userId) {
    return { error: { status: 401, message: "userId missing" } };
  }

  // Check if a user with this email already exists and it's not the current user
  if (email) {
    const userByEmail = await getUserByEmail(email);
    if (userByEmail.data && userByEmail.data.id !== userId) {
      return {
        error: {
          status: 404,
          message: `User with email ${email} already exists`,
        },
      };
    }
  }

  // Fetch user data from database
  const result = await getUser(userId);
  if (result.status === 404 || !result.data) {
    return { error: { status: 404, message: "User not found" } };
  }

  return { existingUser: result.data as User };
}

/**
 * Validates user input data.
 * Distinguishes between full updates and partial updates (patch).
 * Checks fields like email, language, and darkMode for validity.
 *
 * @param {Partial<User>} user - Partial user data to validate
 * @param {string[]} validLanguages - Array of allowed language codes
 * @param {User} [existingUser] - Optional existing user for patch validation context
 * @returns {{valid: boolean; status: number; message?: string}} Validation result object
 */
export function validateUserInput(
  user: Partial<User>,
  validLanguages: string[],
  existingUser?: User
): { valid: boolean; status: number; message?: string } {
  const isPatch = !!existingUser;

  const email = user.email ?? existingUser?.email;
  const language = user.language ?? existingUser?.language;
  const darkMode = user.darkMode ?? existingUser?.darkMode;

  if (existingUser && existingUser.id !== user.id) {
    return {
      valid: false,
      status: 401,
      message: "Users can only edit their own account",
    };
  }

  if (!isPatch || user.email !== undefined) {
    if (!email || !emailRegex.test(email)) {
      return {
        valid: false,
        status: 400,
        message: "A valid email address is required.",
      };
    }
  }

  if (!isPatch || user.language !== undefined) {
    if (language && !validLanguages.includes(language)) {
      return {
        valid: false,
        status: 422,
        message: `Language must be one of: ${validLanguages.join(", ")}`,
      };
    }
  }

  if (!isPatch || user.darkMode !== undefined) {
    if (darkMode !== undefined && typeof darkMode !== "boolean") {
      return {
        valid: false,
        status: 400,
        message: "darkMode must be a boolean value",
      };
    }
  }

  return { valid: true, status: 200 };
}
