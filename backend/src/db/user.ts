/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

/**
 * @module UserService
 * @description Handles user-related database operations.
 */

import { Login, User } from "../models/user.js";
import { GenericResponse, ResultResponse } from "../types/restTypes.js";
import { safeFunctionCall, safeQuerySingleObject } from "../util/safeQuery.js";

/**
 * Gathers a user by id
 *
 * @param userId The id of the current user
 * @returns the current user
 */
const getUser = async (userId: string): Promise<GenericResponse<User>> => {
  return await safeQuerySingleObject<User>(
    `SELECT "id", "email", "dark_mode", "language"
         FROM   "users"
         WHERE  $1::UUID = id
        `,
    [userId]
  );
};

/**
 * Gathers a user by email
 *
 * @param email The email of the user
 * @returns the user with this email
 */
const getUserByEmail = async (
  email: string
): Promise<GenericResponse<User>> => {
  return await safeQuerySingleObject<User>(
    `SELECT "id", "email", "dark_mode", "language"
         FROM   "users"
         WHERE  $1 = email
        `,
    [email]
  );
};

/**
 * Inserts a new user to the database
 *
 * @param data password and e-mail of the new user
 * @returns a HTTP status code and the id of the created user
 */
const postUser = async (data: Login): Promise<ResultResponse> => {
  if (!data.email) return { status: 400, message: "E-Mail is missing" };
  if (!data.password) return { status: 400, message: "Password is missing" };
  return await safeFunctionCall<User>(`SELECT "result" FROM post_user($1)`, [
    data,
  ]);
};

/**
 * Updates all fields of an existing user
 *
 * @param userId The id of the current user
 * @param user The new user
 * @returns a HTTP status code and the id of the updated user
 */
const putUser = async (userId: string, user: User): Promise<ResultResponse> => {
  return await safeFunctionCall<User>(`SELECT "result" FROM put_user($1, $2)`, [
    userId,
    user,
  ]);
};

/**
 * Patches a user
 *
 * @param userId The id of the current user
 * @param user All elements of the user that should be changed
 * @returns a HTTP status code and the id of the updated user
 */
const patchUser = async (
  userId: string,
  user: Partial<User>
): Promise<ResultResponse> => {
  return await safeFunctionCall<User>(
    `SELECT "result" FROM patch_user($1, $2)`,
    [userId, user]
  );
};

/**
 * Deletes a user
 *
 * @param userId The id of the current user
 * @returns a HTTP status code and the id of the deleted user
 */
const deleteUser = async (userId: string): Promise<ResultResponse> => {
  return await safeFunctionCall<User>(`SELECT "result" FROM delete_user($1)`, [
    userId,
  ]);
};

export { postUser, getUser, putUser, patchUser, deleteUser, getUserByEmail };
