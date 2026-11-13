/**
 * @module TaskService
 * @description Handles task-related database operations.
 */

import { Task } from "../models/task.js";
import {
  DBResponse,
  GenericResponse,
  ResultResponse,
} from "../types/restTypes.js";
import {
  safeFunctionCall,
  safeQuery,
  safeQuerySingleObject,
} from "../util/safeQuery.js";
import { GroupedTask } from "../models/groupedTask.js";
import { ExamWithTasks } from "../models/overview.js";

/**
 * Gathers all tasks of the given user
 *
 * @param userId The id of the current user
 * @returns A list of all the tasks of the given user
 */
const getTasks = async (userId: string): Promise<GenericResponse<Task[]>> => {
  return await safeQuery<Task>(
    `SELECT t.id, t.name, t.completed, t.date, t.exam_id
    FROM tasks t
    JOIN exams e on e.id = t.exam_id
    WHERE e.user_id = $1`,
    [userId]
  );
};

/**
 * Gathers all grouped tasks of the given user between two dates
 *
 * @param userId The id of the current user
 * @param start The start of the date range
 * @param end The end of the date range
 * @returns A list of all the grouped tasks of the given user between two dates
 */
const getGroupedTasksBetween = async (
  userId: string,
  start?: Date,
  end?: Date
): Promise<GenericResponse<GroupedTask[]>> => {
  if (start && end) {
    return await safeQuery<GroupedTask>(
      `SELECT *
        FROM grouped_tasks
        WHERE user_id = $1
        AND date BETWEEN $2 AND $3
        ORDER BY date`,
      [userId, start, end]
    );
  }
  return await safeQuery<GroupedTask>(
    `SELECT *
     FROM grouped_tasks
        WHERE user_id = $1
        ORDER BY date`,
    [userId]
  );
};

/**
 * Gathers all exams with it's tasks
 * @param userId The id of the current user
 * @returns a list of exams with all it's tasks
 */
const getAllTasksByExam = async (
  userId: string
): Promise<GenericResponse<ExamWithTasks[]>> => {
  return await safeQuery<ExamWithTasks>(
    `SELECT *
    FROM exam_with_tasks_list
    WHERE user_id = $1`,
    [userId]
  );
};

/**
 * Gathers all tasks of the given user between two dates
 *
 * @param userId The id of the current user
 * @param start The start of the date range
 * @param end The end of the date range
 * @returns A list of all tasks of the given user between two dates
 */
const getTasksBetween = async (
  userId: string,
  start: Date,
  end: Date
): Promise<GenericResponse<Task[]>> => {
  return await safeQuery<Task>(
    `SELECT t.id, t.name, t.completed, t.date, t.exam_id
    FROM tasks t
    JOIN exams e on e.id = t.exam_id
    WHERE e.user_id = $1 AND t.date BETWEEN $2 AND $3`,
    [userId, start, end]
  );
};

/**
 * Gathers a task by id
 *
 * @param userId The id of the current user
 * @param taskId The id of the task
 * @returns a task
 */
const getTask = async (
  userId: string,
  taskId: string
): Promise<GenericResponse<Task | {}>> => {
  return await safeQuerySingleObject<Task>(
    `SELECT t.id, t.name, t.completed, t.date, t.exam_id
    FROM tasks t
    JOIN exams e on e.id = t.exam_id
    WHERE e.user_id = $1 
    AND t.id = $2`,
    [userId, taskId]
  );
};

/**
 * Inserts a new task to the database
 *
 * @param userId The id of the current user
 * @param task The new task
 * @returns a HTTP status code and the id of the created task
 */
const postTask = async (
  userId: string,
  task: Task
): Promise<ResultResponse> => {
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM post_task($1, $2)`,
    [userId, task]
  );
};

/**
 * Updates all fields of an existing task
 *
 * @param userId The id of the current user
 * @param task The new task
 * @param taskId The id of the task that should be changed
 * @returns a HTTP status code and the id of the updated task
 */
const putTask = async (
  userId: string,
  task: Task,
  taskId: string
): Promise<ResultResponse> => {
  task.id = taskId;
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM put_task($1, $2)`,
    [userId, task]
  );
};

/**
 * Patches a task
 *
 * @param userId The id of the current user
 * @param task All elements of the task that should be changed
 * @param taskId The id of the task that should be changed
 * @returns a HTTP status code and the id of the updated task
 */
const patchTask = async (
  userId: string,
  task: Partial<Task>,
  taskId: string
): Promise<ResultResponse> => {
  task.id = taskId;
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM patch_task($1, $2)`,
    [userId, task]
  );
};

/**
 * Deletes a task
 *
 * @param userId The id of the current user
 * @param taskId The id of the task that should be deleted
 * @returns a HTTP status code and the id of the deleted task
 */
const deleteTask = async (
  userId: string,
  taskId: string
): Promise<ResultResponse> => {
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM delete_task($1, $2)`,
    [userId, taskId]
  );
};

export {
  getTasks,
  getTask,
  postTask,
  putTask,
  patchTask,
  deleteTask,
  getAllTasksByExam,
  getTasksBetween,
  getGroupedTasksBetween,
};
