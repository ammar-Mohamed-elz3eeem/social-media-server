"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
function loggerMiddleware(req, res, next) {
    logger_1.logger.debug(`${req.method}\t${req.headers.origin}\t${req.url}`);
    console.log(`${req.method} ${req.path}`);
    next();
}
exports.default = loggerMiddleware;
