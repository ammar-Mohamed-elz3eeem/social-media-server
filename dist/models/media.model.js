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
const db_1 = require("../utils/db");
const promises_1 = require("fs/promises");
const uploader_1 = __importDefault(require("../config/uploader"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const logger_1 = require("../utils/logger");
class Media {
    static addMedia(src, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`INSERT INTO media (post_id, src) VALUES ($1, $2)`, [postId, src]);
                return src;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteMedia(src) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield (0, db_1.sql)(`SELECT * FROM media WHERE src=$1`, [src]);
                const imgPath = path_1.default.join(uploader_1.default.uploads_path, src);
                if (image.rows.length <= 0) {
                    if ((0, fs_1.existsSync)(imgPath)) {
                        (0, promises_1.unlink)(imgPath);
                    }
                    return true;
                }
                else {
                    const deleted = yield (0, db_1.sql)(`DELETE FROM media WHERE src=$1`, []);
                    if ((0, fs_1.existsSync)(imgPath)) {
                        (0, promises_1.unlink)(imgPath);
                    }
                    return true;
                }
            }
            catch (error) {
                logger_1.logger.debug(error.message);
                throw error;
            }
        });
    }
    static getPostMedia(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield (0, db_1.sql)(`SELECT * FROM media WHERE post_id=$1`, [postId]);
                return res.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Media;
