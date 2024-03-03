"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsStorage = exports.avatarStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const uploader_1 = __importDefault(require("./uploader"));
exports.avatarStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        // console.log(file);
        callback(null, uploader_1.default.avatars_path);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
exports.uploadsStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploader_1.default.uploads_path);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
