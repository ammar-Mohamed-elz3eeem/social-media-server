"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { printf, combine, timestamp } = winston_1.format;
const loggerFormat = printf(info => {
    return `${info.timestamp} | ${info.level}: ${info.message}`;
});
exports.logger = (0, winston_1.createLogger)({
    level: 'debug',
    format: combine(winston_1.format.colorize(), timestamp(), loggerFormat),
    transports: [
        new winston_1.transports.Console()
    ]
});
