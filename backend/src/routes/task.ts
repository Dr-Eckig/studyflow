import { Router, Request, Response } from "express";
import { refreshToken } from "./auth.js";
import { isAuthorized } from "../util/auth.js";
import { handleGenericResponse, handleResult } from "../util/safeQuery.js";
import { taskSchema } from "../schema/task-schema.js";
import { Task } from "../models/task.js";
import {
  prepareTaskContext,
  validateTaskInput,
} from "../util/validation/validateTask.js";
import {
  getTasksBetween,
  postTask,
  putTask,
  patchTask,
  deleteTask,
  getTasks,
  getTask,
} from "../db/task.js";
import validate from "../schema/validate.js";

/**
 * Tasks router handles all CRUD operations for tasks.
 * @module Tasks
 */
const Tasks = Router();

Tasks.route("/")
  /**
   * GET /rest/tasks
   * Returns all tasks for the authorized user.
   * Optional query parameters `start` and `end` allow filtering by date.
   *
   * @query {string} [start] - Optional start date (ISO string)
   * @query {string} [end] - Optional end date (ISO string)
   * @returns {Task[]} List of task objects
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const { start, end } = req.query;
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    if (typeof start === "string" && typeof end === "string") {
      const result = await getTasksBetween(
        userId,
        new Date(start),
        new Date(end)
      );
      return handleGenericResponse(res, result);
    }

    const result = await getTasks(userId);
    return handleGenericResponse(res, result);
  })

  /**
   * POST /rest/tasks
   * Creates a new task for the authorized user.
   * Validates task input and related exam context before saving.
   *
   * @body {Task} task - Task object to create
   * @returns {ResultResponse} Created task including generated ID
   */
  .post(
    isAuthorized,
    refreshToken,
    validate({ body: taskSchema }),
    async (req: Request, res: Response) => {
      const userId = req.id;
      const task: Task = req.body;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // load and check existing values
      const context = await prepareTaskContext(userId, task, undefined, false);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate new values
      const validation = validateTaskInput(task, context.exam);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await postTask(userId, task);
      const proxy = req.headers["x-forwarded-host"];
      const host = proxy || req.headers.host;
      const location = `${req.protocol}://${host}${req.baseUrl}/${result.id}`;

      return handleResult(res, result, location);
    }
  );

Tasks.route("/:id")
  /**
   * GET /rest/tasks/:id
   * Fetches a specific task by its ID.
   *
   * @param {string} id - Task ID
   * @returns {Task} Task object
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });
    const { id } = req.params;
    const result = await getTask(userId, id);
    return handleGenericResponse(res, result);
  })

  /**
   * PUT /rest/tasks/:id
   * Replaces an existing task with the given ID.
   * Validates full task input before updating.
   *
   * @param {string} id - Task ID
   * @body {Task} task - Full task object
   * @returns {ResultResponse} Updated task object
   */
  .put(
    isAuthorized,
    refreshToken,
    validate({ body: taskSchema }),
    async (req: Request, res: Response) => {
      const userId = req.id;
      const task: Task = req.body;
      const { id } = req.params;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // load and check existing values
      const context = await prepareTaskContext(userId, task, id, false);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate new values
      const validation = validateTaskInput(task, context.exam);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await putTask(userId, task as Task, id);
      return handleResult(res, result);
    }
  )

  /**
   * PATCH /rest/tasks/:id
   * Partially updates attributes of a task.
   * Validates only the modified fields.
   *
   * @param {string} id - Task ID
   * @body {Partial<Task>} task - Partial task object
   * @returns {ResultResponse} Updated task object
   */
  .patch(
    isAuthorized,
    refreshToken,
    validate({ body: taskSchema }),
    async (req: Request, res: Response) => {
      const userId = req.id;
      const task: Partial<Task> = req.body;
      const { id } = req.params;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // load and check existing values
      const context = await prepareTaskContext(userId, task, id, true);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      const { taskFromDB, exam } = context;

      // validate new values
      const validation = validateTaskInput(task, exam, taskFromDB);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await patchTask(userId, task, id);
      return handleResult(res, result);
    }
  )

  /**
   * DELETE /rest/tasks/:id
   * Deletes a task by its ID.
   * Ensures the task exists before attempting deletion.
   *
   * @param {string} id - Task ID
   * @returns {ResultResponse} Deletion confirmation or error
   */
  .delete(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    // check if task exists
    const taskResponse = await getTask(userId, id);
    const taskFromDB = taskResponse.data as Task;
    if (!taskFromDB) return res.status(404).json({ message: "Task not found" });

    const result = await deleteTask(userId, id);
    return handleResult(res, result);
  });

export { Tasks, taskSchema };
