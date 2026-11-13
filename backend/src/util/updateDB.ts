/**
 * Database maintenance utilities for task-related periodic updates.
 * Used to keep task dates and streak logs up-to-date.
 * @module UpdateDB
 */

import { query } from "../db/index.js";

/**
 * Updates all tasks that are overdue (before today and not completed).
 * Sets their date to the current date.
 *
 * @function
 * @returns {Promise<void>} Logs update info or errors
 */
export async function updateOverdueTasks(): Promise<void> {
  try {
    const res = await query(`
      UPDATE tasks
      SET date = CURRENT_DATE
      WHERE completed = FALSE AND date < CURRENT_DATE
    `);
    console.log(`[DBUtils] Updated ${res.rowCount} overdue tasks.`);
  } catch (error) {
    console.error("[DBUtils] Error updating tasks:", error);
  }
}

/**
 * Inserts or updates daily task completion logs used for streak tracking.
 * Ensures every past day has a `task_completion_log` entry.
 *
 * @function
 * @returns {Promise<void>} Logs update status or errors
 */
export async function updateStreak(): Promise<void> {
  try {
    const result = await query(`
      INSERT INTO task_completion_log (user_id, date, all_tasks_completed)
      SELECT
          e.user_id,
          t.date,
          bool_and(t.completed) AS all_tasks_completed
      FROM tasks t
      JOIN exams e ON t.exam_id = e.id
      WHERE t.date < CURRENT_DATE
      GROUP BY e.user_id, t.date
      ON CONFLICT (user_id, date) DO UPDATE
          SET all_tasks_completed = EXCLUDED.all_tasks_completed;
    `);
    console.log("[DBUtils] Task logs updated.");
  } catch (err) {
    console.error("[DBUtils] Error updating streak log:", err);
  }
}
