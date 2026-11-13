import { Router, Request, Response } from "express";
import { refreshToken } from "./auth.js";
import { isAuthorized } from "../util/auth.js";
import { handleGenericResponse } from "../util/safeQuery.js";
import {
  getWeeklyStatistic,
  getNextExamStatistic,
  getStreak,
} from "../db/statistic.js";

/**
 * Express router for handling user statistics shown on the dashboard.
 * Includes weekly progress, upcoming exams, and learning streaks.
 * @module Statistics
 */

const Statistics = Router();

Statistics.route("/weekly")
  /**
   * GET /rest/statistics/weekly
   * Returns task completion statistics for the current week.
   *
   * @returns {WeeklyStatistics} Weekly task completion statistics
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(400).json({ message: "userId missing" });

    const result = await getWeeklyStatistic(userId);
    return handleGenericResponse(res, result);
  });

Statistics.route("/exam-overview")
  /**
   * GET /rest/statistics/exam-overview
   * Returns an overview of the user's upcoming exams.
   *
   * @returns {ExamStatistics} List of upcoming exams with task status
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(400).json({ message: "userId missing" });

    const result = await getNextExamStatistic(userId);
    return handleGenericResponse(res, result);
  });

Statistics.route("/streak")
  /**
   * GET /rest/statistics/streak
   * Returns the user's current learning streak (number of consecutive active days).
   *
   * @returns {StreakStatistics} Streak information (e.g., count, longest streak)
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(400).json({ message: "userId missing" });

    const result = await getStreak(userId);
    return handleGenericResponse(res, result);
  });

export { Statistics };
