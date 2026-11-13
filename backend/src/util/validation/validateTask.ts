/**
 * @module TaskValidation
 *
 * Provides functions to validate task input data and prepare the task context.
 * Ensures tasks conform to business rules related to deadlines, names, and associated exams.
 */

import { getExam } from "../../db/exam.js";
import { getTask } from "../../db/task.js";
import { Exam } from "../../models/exam.js";
import { Task } from "../../models/task.js";
import { isBefore } from "../dateUtil.js";
type ValidationResult = {
  valid: boolean;
  status: number;
  message?: string;
};

/**
 * Validates the task input fields against business rules and existing data.
 *
 * @param {Partial<Task>} taskInput - The task data to validate (partial allowed for PATCH)
 * @param {Exam} exam - The related exam entity
 * @param {Task} [existingTask] - The existing task from DB for PATCH validation
 * @returns {ValidationResult} Validation result including status and message
 */
export function validateTaskInput(
  taskInput: Partial<Task>,
  exam: Exam,
  existingTask?: Task
): ValidationResult {
  const isPatch = existingTask !== undefined;

  const name = taskInput.name ?? existingTask?.name;
  const date = taskInput.date ?? existingTask?.date;

  // Exam must be valid
  if (!exam || !exam.deadline) {
    return {
      valid: false,
      status: 404,
      message: "The given exam was not found",
    };
  }

  // Task date must exist and be valid
  if (!date || isNaN(new Date(date).getTime())) {
    return {
      valid: false,
      status: 400,
      message: "The given deadline was null or invalid",
    };
  }

  const taskDate = new Date(date);

  // Task date must not be in the past (only if provided in PATCH)
  if (!isPatch || taskInput.date !== undefined) {
    if (isBefore(taskDate)) {
      return {
        valid: false,
        status: 400,
        message: "The given deadline is in the past",
      };
    }
  }

  // Exam must not be in the past
  if (isBefore(exam.deadline)) {
    return {
      valid: false,
      status: 422,
      message: "Tasks can not belong to exams with a deadline in the past",
    };
  }

  // Task must not be after exam deadline
  if (isBefore(exam.deadline, taskDate)) {
    return {
      valid: false,
      status: 422,
      message: "Tasks can not be created after the exam's deadline",
    };
  }

  // Name must be valid (only if provided in PATCH)
  if (!isPatch || taskInput.name !== undefined) {
    if (!name?.trim()) {
      return {
        valid: false,
        status: 400,
        message: "A task needs a valid name",
      };
    }
  }

  return { valid: true, status: 200 };
}

type TaskContext = {
  taskFromDB?: Task;
  exam: Exam;
  error?: { status: number; message: string };
};

/**
 * Prepares the task context by loading the existing task and related exam.
 *
 * @param {string} userId - The ID of the user
 * @param {Partial<Task>} taskInput - The task input data
 * @param {string | undefined} taskId - The task ID (required for PATCH)
 * @param {boolean} isPatch - Whether the operation is a partial update
 * @returns {Promise<TaskContext>} The context including loaded task, exam, or error
 */
export async function prepareTaskContext(
  userId: string,
  taskInput: Partial<Task>,
  taskId: string | undefined,
  isPatch: boolean
): Promise<TaskContext> {
  let taskFromDB: Task | undefined = undefined;
  if (isPatch && taskId) {
    const response = await getTask(userId, taskId);
    taskFromDB = response.data as Task;
    if (!taskFromDB) {
      return {
        error: { status: 404, message: "Task not found" },
        exam: {} as Exam,
      };
    }
  }

  const examId = taskInput.examId ?? taskFromDB?.examId;
  if (!examId) {
    return {
      error: { status: 400, message: "Missing examId" },
      exam: {} as Exam,
    };
  }

  const examResponse = await getExam(userId, examId);
  const exam = examResponse.data as Exam;

  if (!exam || !exam.deadline) {
    return {
      error: { status: 404, message: "Exam not found" },
      exam: {} as Exam,
    };
  }

  return { taskFromDB, exam };
}
