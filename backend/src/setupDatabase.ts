import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config();

const connectionString =
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Set NEON_DATABASE_URL or DATABASE_URL in backend/.env before running db:setup."
  );
}

if (process.env.CONFIRM_DATABASE_SETUP !== "studyflow") {
  throw new Error(
    "Set CONFIRM_DATABASE_SETUP=studyflow to confirm initialization. " +
      "The setup recreates existing StudyFlow tables."
  );
}

const sqlDirectory = fileURLToPath(
  new URL("../../database/sql/", import.meta.url)
);

const migrations = [
  "00_domains.sql",
  "10_rest_functions.sql",
  "20_studyflow.sql",
  "21_functions.sql",
  "22_user_rest.sql",
  "23_exam_rest.sql",
  "24_task_rest.sql",
  "31_i18n_data_de.sql",
  "31_i18n_data_en.sql",
  "32_first_deadline_hint.sql",
];

const pool = new pg.Pool({ connectionString });

try {
  for (const migration of migrations) {
    const sql = await readFile(`${sqlDirectory}/${migration}`, "utf8");
    process.stdout.write(`Applying ${migration} ... `);
    await pool.query(sql);
    console.log("done");
  }

  const result = await pool.query<{ code: string; name: string }>(
    "SELECT code, name FROM i18n_languages ORDER BY code"
  );

  console.log("Database setup complete. Languages:", result.rows);
} finally {
  await pool.end();
}
