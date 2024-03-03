"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(`${err.name}: ${err.message}`);
    res.status(500).send(err.message);
};
exports.default = errorHandler;
