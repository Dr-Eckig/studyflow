/**
 * @module AuthService
 * @description Handles auth-related database operations.
 */

/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

import { Login } from "../models/user.js";
import { ResultResponse } from "../types/restTypes.js";
import { query } from "./index.js";

/**
 * Checks password and e-mail on login
 *
 * @param data The e-mail adress and password of the user
 * @returns A HTTP Status Code and the users id
 */
const postLogin = async (data: Login): Promise<ResultResponse> => {
  if (!data.email) return { status: 400, message: "E-Mail is missing" };
  if (!data.password) return { status: 400, message: "Password is missing" };
  const result = (
    await query(
      `SELECT check_password($1::VARCHAR, $2::VARCHAR) AS "authorized", 
               id
        FROM   users
        WHERE  "email" = $1::VARCHAR
       `,
      [data.email, data.password]
    )
  ).rows[0];

  return result
    ? {
        status: result.authorized ? 200 : 401,
        id: result.id,
      }
    : { status: 401 };
};

export { postLogin };
