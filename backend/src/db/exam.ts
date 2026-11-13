/**
 * @module ExamService
 * @description Handles exam-related database operations.
 */
import { Exam } from "../models/exam.js";
import { GenericResponse, ResultResponse } from "../types/restTypes.js";
import {
  safeQuery,
  safeFunctionCall,
  safeQuerySingleObject,
} from "../util/safeQuery.js";

/**
 * Gathers all exams of the given user
 *
 * @param userId The id of the current user
 * @returns A list of all the exams of the given user
 */
const getExams = async (userId: string): Promise<GenericResponse<Exam[]>> => {
  return await safeQuery<Exam>(
    `SELECT * FROM exams WHERE user_id = $1 ORDER BY deadline`,
    [userId]
  );
};

/**
 * Gathers all exams of the given user between two dates
 *
 * @param userId The id of the current user
 * @param start The start of the date range
 * @param end The end of the date range
 * @returns A list of all the exams of the given user between two dates
 */
const getExamsBetween = async (
  userId: string,
  start: Date,
  end: Date
): Promise<GenericResponse<Exam[]>> => {
  return await safeQuery<Exam>(
    `SELECT *
     FROM exams
     WHERE user_id = $1 AND deadline BETWEEN $2 AND $3
     ORDER BY deadline`,
    [userId, start, end]
  );
};

/**
 * Gathers an exam by id
 *
 * @param userId The id of the current user
 * @param examId The id of the exam
 * @returns an exam
 */
const getExam = async (
  userId: string,
  examId: string
): Promise<GenericResponse<Exam | {}>> => {
  const result = await safeQuerySingleObject<Exam>(
    `SELECT *
     FROM exams
     WHERE id = $1 AND user_id = $2`,
    [examId, userId]
  );

  if (result.status !== 200 || !result.data) {
    return { status: 404, data: {}, message: "Exam not found" };
  }

  return { status: 200, data: result.data };
};

/**
 * Inserts a new exam to the database
 *
 * @param userId The id of the current user
 * @param exam The new exam
 * @returns a HTTP status code and the id of the created exam
 */
const postExam = async (
  userId: string,
  exam: Exam
): Promise<ResultResponse> => {
  exam.userId = userId;
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM post_exam($1, $2)`,
    [userId, exam]
  );
};

/**
 * Updates all fields of an existing exam
 *
 * @param userId The id of the current user
 * @param exam The new exam
 * @param examId The id of the exam that should be changed
 * @returns a HTTP status code and the id of the updated exam
 */
const putExam = async (
  userId: string,
  exam: Exam,
  examId: string
): Promise<ResultResponse> => {
  exam.id = examId;
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM put_exam($1, $2)`,
    [userId, exam]
  );
};

/**
 * Patches an exam
 *
 * @param userId The id of the current user
 * @param exam All elements of the exam that should be changed
 * @param examId The id of the exam that should be changed
 * @returns a HTTP status code and the id of the updated exam
 */
const patchExam = async (
  userId: string,
  exam: Partial<Exam>,
  examId: string
): Promise<ResultResponse> => {
  exam.id = examId;
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM patch_exam($1, $2)`,
    [userId, exam]
  );
};

/**
 * Deletes an exam
 *
 * @param userId The id of the current user
 * @param examId The id of the exam that should be deleted
 * @returns a HTTP status code and the id of the deleted exam
 */
const deleteExam = async (
  userId: string,
  examId: string
): Promise<ResultResponse> => {
  return await safeFunctionCall<ResultResponse>(
    `SELECT result FROM delete_exam($1, $2)`,
    [userId, examId]
  );
};

export {
  getExams,
  getExam,
  postExam,
  putExam,
  patchExam,
  deleteExam,
  getExamsBetween,
};
