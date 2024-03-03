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
class Post {
    static addPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`INSERT INTO posts (${Object.keys(data).join(", ")}) VALUES (${Object.keys(data).map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`, [...Object.values(data)]);
                const insertInUserPosts = yield (0, db_1.sql)(`INSERT INTO user_posts (post_id, user_id, shared) VALUES ($1, $2, false)`, [
                    res.rows[0].id,
                    res.rows[0].created_by
                ]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getLikesCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT total_likes FROM posts WHERE id=$1`, [postId]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static editPost(data, cond) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateKeys = Object.keys(data);
            let updateStr = "";
            let i;
            for (i = 0; i < updateKeys.length; i++) {
                updateStr += `${updateKeys[i]}=$${i + 1}`;
                if (i != updateKeys.length - 1) {
                    updateStr += ", ";
                }
            }
            try {
                const res = yield (0, db_1.sql)(`UPDATE posts SET ${updateStr} WHERE ${Object.keys(cond.where)[0]}=$${i + 1} RETURNING *`, [
                    ...Object.values(data),
                    Object.values(cond.where)[0]
                ]);
                return res.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findOne(cond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT * FROM posts WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
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
    static getSitePosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stmt = `SELECT u.first_name, u.last_name, u.username, u.avatar_url,
      p.id, p.content, p.created_at, p.total_likes, p.created_by as user_id, up.shared, up.posted_at FROM user_posts up 
      INNER JOIN users u ON up.user_id=u.id
      INNER JOIN posts p ON (up.post_id=p.id AND p.created_by=u.id) ORDER BY up.posted_at DESC`;
                const res = yield (0, db_1.sql)(stmt, []);
                return res.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getPostLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT user_id FROM likes WHERE post_id=$1`, [postId]);
                return res.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getPostSaves(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT user_id FROM saves WHERE post_id=$1`, [postId]);
                return res.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getPostShares(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT COUNT(*) FROM user_posts WHERE post_id=$1 AND shared=true`, [postId]);
                return res.rows[0]['count'];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`DELETE FROM posts WHERE id=$1`, [postId]);
                return res.rowCount > 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static sharePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shared = yield (0, db_1.sql)(`INSERT INTO user_posts (user_id, post_id, shared) VALUES ($1, $2, true)`, [userId, postId]);
                return shared;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getSharedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield (0, db_1.sql)(`SELECT * FROM user_posts uposts INNER JOIN posts p on uposts.post_id=p.id WHERE uposts.shared=true`, []);
                return posts;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getSharedPostsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield (0, db_1.sql)(`SELECT * FROM user_posts uposts INNER JOIN posts p on uposts.post_id=p.id WHERE user_id=$1 AND shared=true`, [userId]);
                return posts;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Post;
