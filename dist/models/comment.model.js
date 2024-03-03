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
class Comment {
    static addComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`INSERT INTO comments (post_id, content, created_by, parent_id) VALUES ($1,$2,$3,$4) RETURNING id`, [
                    data.post_id, data.content, data.created_by, data.parent_id
                ]);
                return res.rows[0]['id'];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`DELETE FROM comments WHERE id=$1`, [commentId]);
                return res.rowCount > 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateComment(commentId, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`UPDATE comments SET content=$1 WHERE id=$2`, [newContent, commentId]);
                return res.rowCount > 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findOne(cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT * FROM comments WHERE ${Object.keys(cond.where)[0]}=$1 LIMIT 1`, [Object.values(cond.where)[0]]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findOneById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.findOne({ where: { id: commentId } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findMany(cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT * FROM comments WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
                return res.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getPostComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.findMany({ where: { post_id: postId } });
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Comment;
;
