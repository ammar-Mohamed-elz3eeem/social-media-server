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
class Likes {
    static likedPost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield (0, db_1.sql)(`SELECT * FROM likes WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
                return post.rows.length > 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static like(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield (0, db_1.sql)(`INSERT INTO likes (post_id, user_id) VALUES ($1,$2)`, [postId, userId]);
                return post;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static dislike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield (0, db_1.sql)(`DELETE FROM likes WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
                return post;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Likes;
;
