/**
 * @module StatisticsService
 * @description Handles statsistic-related database operations.
 */

import {
  ExamStatistics,
  StreakStatistics,
  WeeklyStatistics,
} from "../models/statistic.js";
import { GenericResponse } from "../types/restTypes.js";
import { safeQuery, safeQuerySingleObject } from "../util/safeQuery.js";

/**
 * Gathers the given users weekly statistic from the database
 *
 * @param userId The id of the current user
 * @returns A weekly statistic containing the number of open and already done taks
 */
const getWeeklyStatistic = async (
  userId: string
): Promise<GenericResponse<WeeklyStatistics>> => {
  return await safeQuerySingleObject<WeeklyStatistics>(
    `SELECT * FROM weekly_task_progress_view WHERE user_id = $1`,
    [userId]
  );
};

/**
 * Gathers the given users streak statistic
 *
 * @param userId The id of the current user
 * @returns A streak statisic that contains the amount of days without skipping a task
 */
const getStreak = async (
  userId: string
): Promise<GenericResponse<StreakStatistics>> => {
  return await safeQuerySingleObject<StreakStatistics>(
    `SELECT * FROM user_streak_view WHERE user_id = $1`,
    [userId]
  );
};

/**
 * Gathers the given users exam statistic
 *
 * @param userId The id of the current user
 * @returns An exam statistic that contains the date and name of the next exam as well as the amount of days left
 */
const getNextExamStatistic = async (
  userId: string
): Promise<GenericResponse<ExamStatistics>> => {
  return await safeQuerySingleObject<ExamStatistics>(
    `SELECT * FROM next_exam_view WHERE user_id = $1`,
    [userId]
  );
};

export { getWeeklyStatistic, getStreak, getNextExamStatistic };
