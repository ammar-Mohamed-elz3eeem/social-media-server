"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    access_secret: process.env.JWT_ACESSS_SECRET || '',
    refresh_secret: process.env.JWT_REFRESH_SECRET || '',
    jwt_exrpiration: 3600,
    refresh_expiration: 60 * 60 * 24 * 7,
};
