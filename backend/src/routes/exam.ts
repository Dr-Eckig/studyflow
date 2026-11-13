import { Router, Request, Response } from "express";
import { examSchema } from "../schema/exam-schema.js";
import { refreshToken } from "./auth.js";
import { isAuthorized } from "../util/auth.js";
import { handleGenericResponse, handleResult } from "../util/safeQuery.js";
import { Exam } from "../models/exam.js";
import {
  prepareExamContext,
  validateExamInput,
} from "../util/validation/validateExam.js";
import {
  deleteExam,
  getExam,
  getExams,
  getExamsBetween,
  patchExam,
  postExam,
  putExam,
} from "../db/exam.js";
import validate from "../schema/validate.js";

/**
 * Exam router handles all CRUD operations for exams.
 * @module Exams
 */
const Exams = Router();

Exams.route("/")
  /**
   * GET /exams/
   * Retrieves all exams for the authenticated user.
   *
   * @query {string} [start] - Optional start date
   * @query {string} [end] - Optional end date
   * @returns {Exam[]} List of exam objects
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const { start, end } = req.query;
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    if (typeof start === "string" && typeof end === "string") {
      const result = await getExamsBetween(
        userId,
        new Date(start),
        new Date(end)
      );
      return handleGenericResponse(res, result);
    }

    const { status, data } = await getExams(userId);
    return res.status(status).json(data);
  })

  /**
   * POST /exams/
   * Creates a new exam for the authenticated user.
   * Validates input and responds with the location of the created resource.
   *
   * @body {Exam} exam - New exam object
   * @returns {ResultResponse} Created exam with location header
   */
  .post(
    isAuthorized,
    refreshToken,
    validate({ body: examSchema }),
    async (req: Request, res: Response) => {
      const userId = req.id;
      const exam: Exam = req.body;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // validate new values
      const validation = validateExamInput(exam, undefined);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await postExam(userId, exam);
      const proxy = req.headers["x-forwarded-host"];
      const host = proxy || req.headers.host;
      const location = `${req.protocol}://${host}${req.baseUrl}/${result.id}`;

      return handleResult(res, result, location);
    }
  );

Exams.route("/:id")
  /**
   * GET /exams/:id
   * Retrieves a single exam by ID for the authenticated user.
   *
   * @param {string} id - Exam ID from the URL path
   * @returns {Exam} Exam object
   */
  .get(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    const { id } = req.params;
    const result = await getExam(userId, id);
    return handleGenericResponse(res, result);
  })

  /**
   * PUT /exams/:id
   * Fully updates an exam for the user.
   * All required fields must be provided.
   *
   * @param {string} id - Exam ID
   * @body {Exam} exam - Full exam object
   * @returns {ResultResponse} Updated exam
   */
  .put(
    isAuthorized,
    refreshToken,
    validate({ body: examSchema }),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.id;
      const exam: Exam = req.body;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // load and check existing values
      const context = await prepareExamContext(userId, id, false);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate new values
      const validation = validateExamInput(exam, context.existingExam);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await putExam(userId, exam, id);
      return handleResult(res, result);
    }
  )

  /**
   * PATCH /exams/:id
   * Partially updates fields of an exam.
   * Only the provided fields are changed.
   *
   * @param {string} id - Exam ID
   * @body {Partial<Exam>} exam - Fields to update
   * @returns {ResultResponse} Updated exam object
   */
  .patch(
    isAuthorized,
    refreshToken,
    validate({ body: examSchema }),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.id;
      const exam: Partial<Exam> = req.body;

      if (!userId) return res.status(401).json({ message: "userId missing" });

      // load and check existing values
      const context = await prepareExamContext(userId, id, true);
      if (context.error) {
        return res
          .status(context.error.status)
          .json({ message: context.error.message });
      }

      // validate new values
      const validation = validateExamInput(exam, context.existingExam);
      if (!validation.valid) {
        return res
          .status(validation.status)
          .json({ message: validation.message });
      }

      const result = await patchExam(userId, exam, id);
      return handleResult(res, result);
    }
  )

  /**
   * DELETE /exams/:id
   * Deletes an exam for the authenticated user.
   *
   * @param {string} id - Exam ID
   * @returns {ResultResponse} Deletion confirmation or error message
   */
  .delete(isAuthorized, refreshToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "userId missing" });

    // check if exam exists
    const examResult = await getExam(userId, id);
    if (examResult.status === 404)
      return handleGenericResponse(res, examResult);

    // delete exam
    const result = await deleteExam(userId, id);
    return handleResult(res, result);
  });

export { Exams, examSchema };
