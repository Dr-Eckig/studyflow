import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config();

const connectionString =
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Set NEON_DATABASE_URL or DATABASE_URL in backend/.env before running db:fix-i18n."
  );
}

const migrationPath = fileURLToPath(
  new URL("../../database/sql/33_i18n_fixes.sql", import.meta.url)
);
const sql = await readFile(migrationPath, "utf8");
const pool = new pg.Pool({ connectionString });

try {
  await pool.query(sql);

  const result = await pool.query<{
    lang_code: string;
    key: string;
    value: string;
  }>(
    `SELECT lang_code, key, value
       FROM i18n_translations
      WHERE key IN (
        'calendar_title_input',
        'calendar_color_input',
        'calendar_description_input',
        'error_exam_delete'
      )
      ORDER BY lang_code, key`
  );

  console.log("i18n fixes applied:", result.rows);
} finally {
  await pool.end();
}
