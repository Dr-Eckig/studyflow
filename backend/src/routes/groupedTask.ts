import { Router, Request, Response } from "express";
import { refreshToken } from "./auth.js";
import { isAuthorized } from "../util/auth.js";
import { handleGenericResponse } from "../util/safeQuery.js";
import { getGroupedTasksBetween } from "../db/task.js";

/**
 * Express router for handling grouped tasks used in the calendar view.
 * @module GroupedTask
 */

const GroupedTask = Router();

GroupedTask.route("/")
  /**
   * GET /grouped-task/
   * Retrieves grouped tasks between two dates for the authenticated user.
   * Used for the calendar view.
   *
   * @query {string} start - Start date (ISO string)
   * @query {string} end - End date (ISO string)
   * @returns {GroupedTask[]} List of grouped tasks by day
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const { start, end } = req.query;
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    const result = await getGroupedTasksBetween(
      userId,
      typeof start === "string" ? new Date(start) : undefined,
      typeof end === "string" ? new Date(end) : undefined
    );
    return handleGenericResponse(res, result);
  });

export { GroupedTask };
