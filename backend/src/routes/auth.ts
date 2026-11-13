/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

// see https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

import jwt from "jsonwebtoken";
import validate from "../schema/validate.js";
import { isNotAuthorized } from "../util/auth.js";
import { postLogin } from "../db/auth.js";
import { NextFunction, Response, Router, Request } from "express";
import { Login } from "../models/user.js";
import { validateLoginInput } from "../util/validation/validateLogin.js";
import { getUserByEmail, postUser } from "../db/user.js";
import { userSchema } from "../schema/user-schema.js";

/**
 * Express router for authentication: login, register and token handling.
 * @module Auth
 */
const Auth = Router(),
  {
    TOKEN_SECRET = "Please set the secret value in .env: TOKEN_SECRET=...",
    TOKEN_EXPIRES = "3600",
  } = process.env;

/**
 * Middleware to refresh JWT token.
 * Adds a fresh Authorization header to the response.
 *
 * @function
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Callback to the next middleware
 */
const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = jwt.sign({ id: req.id }, TOKEN_SECRET, {
    expiresIn: parseInt(TOKEN_EXPIRES),
  });

  res.set("Authorization", `Bearer ${token}`);
  next();
};

/**
 * POST /login
 * Authenticates user credentials and returns a JWT token if successful.
 *
 * @body {Login} login - Login credentials
 * @returns {ResultResponse} If successful, returns JWT token and user ID; otherwise, error message
 */
Auth.post(
  "/login",
  isNotAuthorized,
  validate({ body: userSchema }),
  async (req, res) => {
    const login: Login = req.body;
    if (!login || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required." });
    }

    // validate login fields
    const validation = validateLoginInput(login);
    if (!validation.valid) {
      return res
        .status(validation.status)
        .json({ message: validation.message });
    }
    const { status, id } = await postLogin(login);

    // set token
    if (status === 200) {
      const token = jwt.sign({ id }, TOKEN_SECRET, {
        expiresIn: parseInt(TOKEN_EXPIRES),
      });

      return res
        .set("Authorization", `Bearer ${token}`)
        .status(200)
        .json({ message: "logged in", token, userId: id });
    } else {
      return res.status(status).json({ message: "not logged in" });
    }
  }
);

/**
 * POST /register
 * Registers a new user if the email doesn't already exist.
 *
 * @body {Login} login - User registration credentials
 * @returns {ResultResponse} If successful, returns the created user and location header; otherwise, error message
 */
Auth.post(
  "/register",
  isNotAuthorized,
  validate({ body: userSchema }),
  async (req: Request, res: Response) => {
    const login: Login = req.body;
    if (!login || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required." });
    }

    // check if a user with this email already exists
    const userByEmail = await getUserByEmail(login.email);
    if (userByEmail.status !== 200 && userByEmail.status !== 404) {
      return res.status(userByEmail.status).json({ message: userByEmail.message });
    }
    if (userByEmail.data) {
      return res.status(409).json({
        message: `User with email ${login.email} already exists`,
      });
    }

    // validate input
    const validation = validateLoginInput(login);
    if (!validation.valid) {
      return res
        .status(validation.status)
        .json({ message: validation.message });
    }

    // create user
    const result = await postUser(req.body);
    const proxy = req.headers["x-forwarded-host"];
    const host = proxy ? proxy : req.headers.host;

    return res
      .set("Location", `${req.protocol}://${host}${req.baseUrl}/${result.id}`)
      .status(result.status)
      .json(result);
  }
);

export { Auth, refreshToken, userSchema };
