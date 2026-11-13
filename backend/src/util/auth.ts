/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

/**
 * Middleware utilities for authentication and authorization checks using JWT tokens.
 * Used to restrict or allow access to protected routes based on user authentication state.
 * @module AuthMiddleware
 */

import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Secret for signing and verifying JWT tokens
const {
  TOKEN_SECRET = "Please set the secret value in .env: TOKEN_SECRET=...",
} = process.env;

/**
 * Middleware that ensures the user is **not** already authenticated.
 * Used for routes like `/login` or `/register` to prevent re-login.
 *
 * @function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Callback to next middleware
 * @returns {void} Responds with 400 if already authorized; otherwise calls `next()`
 */
function isNotAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers["authorization"]) {
    next();
  } else {
    res.status(400).json({ message: "already authorized" });
  }
}

/**
 * Middleware that ensures the user **is** authenticated.
 * Verifies a JWT token and adds the user's ID to the request object.
 *
 * @function
 * @param {Request} req - Express request object (expects `Authorization: Bearer <token>`)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Callback to next middleware
 * @returns {void} Responds with 401 if not authorized; otherwise sets `req.id` and continues
 */
function isAuthorized(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (err, payload) => {
    if (err || typeof payload !== "object" || payload === null) {
      res.status(401).json({ message: "not authorized" });
      return;
    }

    const jwtPayload = payload as JwtPayload;
    req.id = jwtPayload.id as string;

    next();
  });
}

export { isAuthorized, isNotAuthorized };
