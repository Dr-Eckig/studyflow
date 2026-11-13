import { Router, Request, Response } from "express";
import { refreshToken } from "./auth.js";
import { isAuthorized } from "../util/auth.js";
import { handleGenericResponse } from "../util/safeQuery.js";
import { normalizeExamWithTasks } from "../models/overview.js";
import { getAllTasksByExam } from "../db/task.js";

/**
 * Express router to get an overview of tasks grouped by exams.
 * Primarily used for displaying progress and organizing tasks by exam.
 * @module Overview
 */

const Overview = Router();

Overview.route("/")
  /**
   * GET /overview/
   * Returns all tasks grouped by exam for the authenticated user.
   *
   * @returns {ExamWithTasks[]} List of grouped tasks per exam
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    const result = await getAllTasksByExam(userId);
    return handleGenericResponse(res, {
      ...result,
      data: result.data?.map(normalizeExamWithTasks) ?? [],
    });
  });

export { Overview };
