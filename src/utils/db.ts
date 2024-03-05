import { Pool, PoolClient } from "pg";
import dbConfig from "../config/database";
import { logger } from "./logger";

const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  max: dbConfig.maxConnections,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  ssl: true
};

export const pool = new Pool(pgConfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgConfig)}`);

pool.on('error', (err) => {
  logger.error(`IDLE Client Error: ${err.message} | ${err.stack}`);
});

export async function sql(sql: string, data: any[]) {
  logger.debug(`SQL Statement Excuted: ${sql} | ${data}`);
  try {
    const result = await pool.query(sql, data);
    return result;
  } catch (error) {
    logger.error(`sql() error: ${error}`);
    throw error;
  }
}

export async function singleSQL(client: PoolClient, sql: string, data: any[]) {
  logger.debug(`singleSQL() sql: ${sql} | data: ${data}`);
  try {
    const result = await client.query(sql, data);
    logger.debug(`singleSQL(): ${result.command} | ${result.rowCount}`);
    return result;
  } catch (error) {
    logger.error(`singleSQL() error: ${error}`);
    throw error;
  }
}

export async function MultiSQL(client: PoolClient, sql: string, data: any[]) {
  logger.debug(`inside MultiSQL()`);
  if (data.length <= 0) {
    for (const item of data) {
      try {
        logger.debug(`MultiSQL() item: ${item}`);
        logger.debug(`MultiSQL() sql: ${sql}`);
        await client.query(sql, data);
      } catch (error) {
        logger.error(`MultiSQL() Error: ${error}`);
        throw error;
      }
    }
  } else {
    logger.error(`MultiSQL(): No data available`);
    throw new Error('MultiSQL(): No data available');
}
}

export async function getTransaction() {
  logger.debug("Transaction call started!");
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    return client;
  } catch (err) {
    logger.error(`getTransaction() Error: ${err}`);
    throw err;
  }
}

export async function commit(client: PoolClient) {
  try {
    await client.query('COMMIT');
  } catch (error) {
    logger.error(`getTransaction() Error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
}

export async function rollback(client: PoolClient) {
  if (typeof client !== 'undefined' && client) {
    try {
      logger.info(`SQL Transaction Rollback`);
      await client.query('ROLLBACK');
    } catch (err) {
      logger.error(`getTransaction() Error: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  } else {
    logger.warn('No Client found in the pool');
  }
}
