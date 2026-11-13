/**
 * Safe database access utilities for consistent error handling and key transformation.
 * Automatically converts snake_case to camelCase.
 * @module SafeQuery
 */

import { query } from "../db/index.js";
import {
  DBResponse,
  GenericResponse,
  ResultResponse,
} from "../types/restTypes.js";
import { Response } from "express";

/**
 * Converts snake_case strings to camelCase.
 *
 * @function
 * @param {string} str - The snake_case string
 * @returns {string} The camelCase version
 */
const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Recursively converts all object keys from snake_case to camelCase.
 *
 * @function
 * @template T
 * @param {any} obj - Object or array to convert
 * @returns {T} Transformed object with camelCase keys
 */
function keysToCamel<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamel(v)) as T;
  } else if (obj instanceof Date) {
    return obj as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamel(key),
        keysToCamel(value),
      ])
    ) as T;
  }
  return obj;
}

/**
 * Executes a SQL query and returns all matching rows as camelCase objects.
 *
 * @function
 * @template T
 * @param {string} sql - SQL query string
 * @param {any[]} params - Query parameters
 * @returns {Promise<GenericResponse<T[]>>} Result or error object
 */
export async function safeQuery<T>(
  sql: string,
  params: any[]
): Promise<GenericResponse<T[]>> {
  try {
    const result: DBResponse<T> = await query(sql, params);
    const camelized = keysToCamel<T[]>(result.rows);
    return { status: 200, data: camelized };
  } catch (err: any) {
    console.error(
      `[Database] Query failed (${err?.code ?? "unknown"}): ${
        err?.message ?? "Database query failed"
      }`
    );
    return {
      status: 500,
      message: err.message || "Database query failed",
    };
  }
}

/**
 * Executes a SQL query expected to return a single object.
 *
 * @function
 * @template T
 * @param {string} sql - SQL query string
 * @param {any[]} params - Query parameters
 * @returns {Promise<GenericResponse<T>>} Result or error object
 */
export async function safeQuerySingleObject<T>(
  sql: string,
  params: any[]
): Promise<GenericResponse<T>> {
  try {
    const result: DBResponse<T> = await query(sql, params);

    if (result.rows.length === 0) {
      return {
        status: 404,
        message: "Not found",
      };
    }

    const camelized = keysToCamel<T>(result.rows[0]);
    return { status: 200, data: camelized };
  } catch (err: any) {
    console.error(
      `[Database] Query failed (${err?.code ?? "unknown"}): ${
        err?.message ?? "Database query failed"
      }`
    );
    return {
      status: 500,
      message: err.message || "Database query failed",
    };
  }
}

/**
 * Executes a SQL function returning a `result` object with status and message.
 *
 * @function
 * @template T
 * @param {string} sql - SQL call
 * @param {any[]} params - Parameters
 * @returns {Promise<ResultResponse>} Result or error object
 */
export async function safeFunctionCall<T>(
  sql: string,
  params: any[]
): Promise<ResultResponse> {
  try {
    const result: DBResponse<{ result: ResultResponse }> = await query(
      sql,
      params
    );
    return result.rows[0].result;
  } catch (err: any) {
    console.error(
      `[Database] Function call failed (${err?.code ?? "unknown"}): ${
        err?.message ?? "Database query failed"
      }`
    );
    return {
      status: 500,
      message: err.message || "Database query failed",
    };
  }
}

/**
 * Sends an HTTP response based on the result of a mutation.
 * Optionally sets the `Location` header.
 *
 * @function
 * @param {Response} res - Express response object
 * @param {ResultResponse} result - Result from DB
 * @param {string} [locationUrl] - Optional location URL for `Location` header
 * @returns {Response} Final Express response
 */
export function handleResult(
  res: Response,
  result: ResultResponse,
  locationUrl?: string
): Response {
  if (result.status >= 400) {
    return res.status(result.status).json({ message: result.message });
  }

  if (locationUrl) {
    res.set("Location", locationUrl);
  }

  return res.status(result.status).json(result);
}

/**
 * Sends an HTTP response for a generic data fetch.
 *
 * @function
 * @template T
 * @param {Response} res - Express response object
 * @param {GenericResponse<T>} result - Data or error object
 * @returns {Response} Final Express response
 */
export function handleGenericResponse<T>(
  res: Response,
  result: GenericResponse<T>
) {
  if (result.status >= 400) {
    return res.status(result.status).json({ message: result.message });
  }
  return res.status(result.status).json(result.data);
}
