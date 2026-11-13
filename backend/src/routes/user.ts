/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

import { Router, Request, Response } from "express";
import validate from "../schema/validate.js";
import { isAuthorized } from "../util/auth.js";
import { refreshToken } from "./auth.js";
import { handleGenericResponse, handleResult } from "../util/safeQuery.js";
import { userSchema } from "../schema/user-schema.js";
import {
  prepareUserContext,
  validateUserInput,
} from "../util/validation/validateUser.js";
import { User } from "../models/user.js";
import { getLanguages } from "../db/i18n.js";
import { getUser, putUser, patchUser, deleteUser } from "../db/user.js";

/**
 * Users router handles all CRUD operations for users.
 * @module Users
 */
const Users = Router();

Users.route("/:id")

  /**
   * GET /rest/users/:id
   * Returns the current user's profile.
   * Rejects access if the requested ID does not match the JWT token.
   *
   * @param {string} id - User ID from the URL path
   * @returns {User} User profile data
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    if (req.id !== req.params.id) {
      res.status(401).json({ message: "not authorized" });
      return;
    }

    const result = await getUser(req.params.id);
    return handleGenericResponse(res, result);
  })

  /**
   * PUT /rest/users/:id
   * Replaces the current user's profile with new data.
   * Validates input and ensures language codes are valid.
   *
   * @param {string} id - User ID from the URL path
   * @body {User} user - Complete user object to update
   * @returns {ResultResponse} Updated user profile
   */
  .put(
    isAuthorized,
    validate({ body: userSchema }),
    refreshToken,
    async (req: Request, res: Response) => {
      const user: User = req.body;
      const userId = req.id;
      if (!userId) return res.status(401).json({ message: "userId missing" });
      user.id = userId;

      //check if user is the user that will be edited
      if (req.id !== req.params.id) {
        res
          .status(401)
          .json({ message: "Users can only edit their own account" });
        return;
      }

      // check if user exists
      const context = await prepareUserContext(userId, user.email);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate input
      const validLanguages = (await getLanguages()).data?.languages;
      const validation = validateUserInput(
        user,
        validLanguages || ["de", "en"],
        context.existingUser
      );
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await putUser(userId, user);
      return handleResult(res, result);
    }
  )

  /**
   * PATCH /rest/users/:id
   * Updates selected fields of the current user's profile.
   * Validates only modified data.
   *
   * @param {string} id - User ID from the URL path
   * @body {Partial<User>} user - Partial user object to update
   * @returns {ResultResponse} Updated user profile
   */
  .patch(
    isAuthorized,
    validate({ body: userSchema }),
    refreshToken,
    async (req: Request, res: Response) => {
      const user: Partial<User> = req.body;
      const userId = req.id;
      user.id = userId;

      //check if user is the user that will be edited
      if (req.id !== req.params.id) {
        res
          .status(401)
          .json({ message: "Users can only edit their own account" });
        return;
      }

      // check if user exists
      const context = await prepareUserContext(userId, user.email);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate input
      const validLanguages = (await getLanguages()).data?.languages;
      const validation = validateUserInput(
        user,
        validLanguages || ["de", "en"],
        context.existingUser
      );
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await patchUser(req.params.id, req.body);
      return handleResult(res, result);
    }
  )

  /**
   * DELETE /rest/users/:id
   * Deletes the current user's account.
   * Rejects access if the ID doesn't match the authenticated user.
   *
   * @param {string} id - User ID from the URL path
   * @returns {ResultResponse} Deletion confirmation or error message
   */
  .delete(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    if (req.id !== req.params.id) {
      res.status(401).json({ message: "not authorized" });
      return;
    }

    // check if user exists
    const userResult = await getUser(req.params.id);
    if (userResult.status === 404)
      return handleGenericResponse(res, userResult);

    // check if user exists
    const result = await deleteUser(req.params.id);
    return handleResult(res, result);
  });

export { Users, userSchema };
