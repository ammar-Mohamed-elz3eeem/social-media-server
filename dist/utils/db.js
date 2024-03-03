"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollback = exports.commit = exports.getTransaction = exports.MultiSQL = exports.singleSQL = exports.sql = exports.pool = void 0;
const pg_1 = require("pg");
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("./logger");
const pgConfig = {
    user: database_1.default.user || '',
    password: database_1.default.password || '',
    host: database_1.default.host || '',
    port: Number(database_1.default.port) || 0,
    database: database_1.default.database || '',
    max: database_1.default.maxConnections,
    idleTimeoutMillis: database_1.default.idleTimeoutMillis
};
exports.pool = new pg_1.Pool(pgConfig);
logger_1.logger.info(`DB Connection Settings: ${JSON.stringify(pgConfig)}`);
exports.pool.on('error', (err) => {
    logger_1.logger.error(`IDLE Client Error: ${err.message} | ${err.stack}`);
});
function sql(sql, data) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug(`SQL Statement Excuted: ${sql} | ${data}`);
        try {
            const result = yield exports.pool.query(sql, data);
            return result;
        }
        catch (error) {
            logger_1.logger.error(`sql() error: ${error}`);
            throw error;
        }
    });
}
exports.sql = sql;
function singleSQL(client, sql, data) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug(`singleSQL() sql: ${sql} | data: ${data}`);
        try {
            const result = yield client.query(sql, data);
            logger_1.logger.debug(`singleSQL(): ${result.command} | ${result.rowCount}`);
            return result;
        }
        catch (error) {
            logger_1.logger.error(`singleSQL() error: ${error}`);
            throw error;
        }
    });
}
exports.singleSQL = singleSQL;
function MultiSQL(client, sql, data) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug(`inside MultiSQL()`);
        if (data.length <= 0) {
            for (const item of data) {
                try {
                    logger_1.logger.debug(`MultiSQL() item: ${item}`);
                    logger_1.logger.debug(`MultiSQL() sql: ${sql}`);
                    yield client.query(sql, data);
                }
                catch (error) {
                    logger_1.logger.error(`MultiSQL() Error: ${error}`);
                    throw error;
                }
            }
        }
        else {
            logger_1.logger.error(`MultiSQL(): No data available`);
            throw new Error('MultiSQL(): No data available');
        }
    });
}
exports.MultiSQL = MultiSQL;
function getTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug("Transaction call started!");
        const client = yield exports.pool.connect();
        try {
            yield client.query('BEGIN');
            return client;
        }
        catch (err) {
            logger_1.logger.error(`getTransaction() Error: ${err}`);
            throw err;
        }
    });
}
exports.getTransaction = getTransaction;
function commit(client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query('COMMIT');
        }
        catch (error) {
            logger_1.logger.error(`getTransaction() Error: ${error}`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.commit = commit;
function rollback(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof client !== 'undefined' && client) {
            try {
                logger_1.logger.info(`SQL Transaction Rollback`);
                yield client.query('ROLLBACK');
            }
            catch (err) {
                logger_1.logger.error(`getTransaction() Error: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        }
        else {
            logger_1.logger.warn('No Client found in the pool');
        }
    });
}
exports.rollback = rollback;
