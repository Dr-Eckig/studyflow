/**
 * @module IndexService
 * @description sets up database connection
 */

/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2024
 * @license   MIT
 */

import pg, { PoolClient } from "pg";

const {
    DATABASE_URL,
    NEON_DATABASE_URL,
    PG_HOST = "localhost",
    PG_USER = "studyuser",
    PG_PASSWORD = "studypass",
    PG_DATABASE = "studyflow",
    PG_PORT = "5432",
  } = process.env,
  connectionString = NEON_DATABASE_URL || DATABASE_URL,
  c_pool = new pg.Pool(
    connectionString
      ? { connectionString }
      : {
          host: PG_HOST,
          user: PG_USER,
          password: PG_PASSWORD,
          database: PG_DATABASE,
          port: parseInt(PG_PORT, 10),
        }
  ),
  query = async (p_sql: string, p_params?: any[]) =>
    await c_pool.query(p_sql, p_params),
  transaction = async (
    p_query_callback: (client: PoolClient) => Promise<void>
  ) => {
    const c_client = await c_pool.connect();
    try {
      await c_client.query("BEGIN");
      await p_query_callback(c_client);
      await c_client.query("COMMIT");
    } catch (p_error) {
      await c_client.query("ROLLBACK");
      throw p_error;
    } finally {
      c_client.release();
    }
  };

export { query, transaction };
