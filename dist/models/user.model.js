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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
class User {
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)("INSERT INTO users (first_name, last_name, username, email, password, date_of_birth, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [user.first_name, user.last_name, user.username, user.email, user.password, user.dob, user.phone]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateRefreshToken(refresh_token, cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`UPDATE users SET refresh_token=$1 WHERE ${Object.keys(cond.where)[0]}=$2`, [refresh_token, Object.values(cond.where)[0]]);
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findOne(cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT * FROM users WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.findOne({ where: { id: id } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findAll(cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sqlCommand = `SELECT * FROM users`;
                let data = [];
                if (cond) {
                    sqlCommand += ` WHERE ${Object.keys(cond.where)[0]}=$1`;
                    data.push(Object.values(cond.where)[0]);
                }
                const res = yield (0, db_1.sql)(sqlCommand, data);
                return res.rows.length > 0 && res.rows || null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static update(data, cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateKeys = Object.keys(data);
                let updateStr = "";
                let i;
                for (i = 0; i < updateKeys.length; i++) {
                    updateStr += `${updateKeys[i]}=$${i + 1}`;
                    if (i != updateKeys.length - 1) {
                        updateStr += ", ";
                    }
                }
                const result = yield (0, db_1.sql)(`UPDATE users SET ${updateStr} WHERE ${Object.keys(cond.where)[0]}=$${i + 1} RETURNING *`, [
                    ...Object.values(data),
                    Object.values(cond.where)[0]
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updatePassword(password, cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, db_1.sql)(`UPDATE users SET password=$1 WHERE ${Object.keys(cond.where)[0]}=$2`, [
                    password,
                    Object.values(cond.where)[0]
                ]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)('DELETE FROM users WHERE id=$1', [id]);
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = User;
