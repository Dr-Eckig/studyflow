/**
 * @module ExamValidation
 *
 * Validates exam input data.
 * Checks for required fields, valid dates, and allowed tag colors.
 * Differentiates between full create/replace and partial patch operations.
 */

import { Exam } from "../../models/exam.js";
import { isBefore } from "../dateUtil.js";
import { TagColor } from "../../constants/colors.js";
import { getExam } from "../../db/exam.js";

/**
 * Validates the input for an exam creation or update.
 *
 * @function
 * @param {Partial<Exam>} examInput - Input data to validate
 * @param {Exam} [existingExam] - Existing exam (for PATCH operations)
 * @returns {{ valid: boolean; status: number; message?: string }}
 *   Validation result object:
 *   - valid: whether the input is valid
 *   - status: HTTP status code to return if invalid
 *   - message: error message if invalid
 */
export function validateExamInput(
  examInput: Partial<Exam>,
  existingExam?: Exam
): { valid: boolean; status: number; message?: string } {
  const isPatch = existingExam !== undefined;

  // Use new values if given, otherwise fallback to existing ones
  const deadline = examInput.deadline ?? existingExam?.deadline;
  const title = examInput.title ?? existingExam?.title;
  const tagColor = examInput.tagColor ?? existingExam?.tagColor;

  // Validate deadline presence and correctness
  if (!deadline || isNaN(new Date(deadline).getTime())) {
    return {
      valid: false,
      status: 400,
      message: "The given deadline was null or invalid",
    };
  }

  // For creates or if deadline changed in patch: deadline must not be in the past
  if (!isPatch || examInput.deadline !== undefined) {
    if (isBefore(deadline)) {
      return {
        valid: false,
        status: 422,
        message: "The deadline can not be in the past",
      };
    }
  }

  // For creates or if title changed in patch: title must be non-empty
  if (!isPatch || examInput.title !== undefined) {
    if (!title?.trim()) {
      return {
        valid: false,
        status: 400,
        message: "An exam needs a valid title",
      };
    }
  }

  // For creates or if tagColor changed in patch: tagColor must be valid enum value
  if (!isPatch || examInput.tagColor !== undefined) {
    if (!tagColor || !Object.values(TagColor).includes(tagColor)) {
      return {
        valid: false,
        status: 400,
        message: `TagColor must be one of: ${Object.values(TagColor).join(
          ", "
        )}`,
      };
    }
  }

  return { valid: true, status: 200 };
}

/**
 * Prepares the exam context before validating or updating.
 * Loads the existing exam if applicable.
 * Checks for user authorization.
 *
 * @function
 * @param {string | undefined} userId - Current user's ID
 * @param {string | undefined} examId - Exam ID to load (for update/patch)
 * @param {boolean} isPatch - Whether this is a patch (partial update)
 * @returns {Promise<{existingExam?: Exam; error?: {status: number; message: string}}>}
 *   Returns either the loaded exam or an error object
 */
export async function prepareExamContext(
  userId: string | undefined,
  examId: string | undefined,
  isPatch: boolean
): Promise<{
  existingExam?: Exam;
  error?: { status: number; message: string };
}> {
  if (!userId) {
    return { error: { status: 401, message: "userId missing" } };
  }

  if (!isPatch) {
    return {}; // no existing exam needed for create
  }

  const result = await getExam(userId, examId!);
  if (result.status === 404 || !result.data) {
    return { error: { status: 404, message: "Exam not found" } };
  }

  return { existingExam: result.data as Exam };
}
