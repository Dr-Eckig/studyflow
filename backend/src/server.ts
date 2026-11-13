/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

import express, { Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import * as uuid from "uuid";
import { Auth } from "./routes/auth.js";
import { Users } from "./routes/user.js";
import { Exams } from "./routes/exam.js";
import { Tasks } from "./routes/task.js";
import { Statistics } from "./routes/statistic.js";
import { ValidationError } from "express-json-validator-middleware";
import dotenv from "dotenv";
import { Languages } from "./routes/i18n.js";
import { Overview } from "./routes/overview.js";
import { GroupedTask } from "./routes/groupedTask.js";
import cron from "node-cron";
import { updateOverdueTasks, updateStreak } from "./util/updateDB.js";
dotenv.config();
const PORT = Number(process.env.PORT) || 4000;
const SERVER = process.env.SERVER || `http://localhost:${PORT}`;
const c_app = express();
const c_uuid = uuid.v4;

// Middleware for file uploads
c_app.use(fileUpload());
// Middleware for logging HTTP requests
c_app.use(morgan("combined"));

// For testing purposes: a UUID endpoint
c_app.get("/uuid", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json(c_uuid());
});

// Middleware to parse JSON bodies
c_app.use(express.json());

// Register routes
c_app.use("", Auth);
c_app.use("/user", Users);
c_app.use("/exam", Exams);
c_app.use("/grouped-task", GroupedTask);
c_app.use("/overview", Overview);
c_app.use("/task", Tasks);
c_app.use("/statistic", Statistics);
c_app.use("/i18n", Languages);
// Error handling middleware for JSON schema validation errors

c_app.use(
  (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ValidationError) {
      res.status(400).json(error.validationErrors);
    } else {
      next(error);
    }
  }
);

// Start the server
c_app.listen(PORT, async () => {
  console.log(`Running on ${SERVER}`);
  await updateOverdueTasks();
  await updateStreak();
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running overdue task adjustment...");
    await updateOverdueTasks();
    await updateStreak();
  });
});
