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
const uploader_1 = __importDefault(require("../config/uploader"));
const promises_1 = require("fs/promises");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
function imageUpload(file, uploadPath, deleteOriginal = false) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("file.path", file.path);
        if (file) {
            if (!uploader_1.default.allowed_types.includes(file.mimetype)) {
                yield (0, promises_1.unlink)(file.path);
                throw new Error('Not Allowed image type');
            }
            if (file.size >= 1024 * 1024 * 10) {
                yield (0, promises_1.unlink)(file.path);
                throw new Error('maximum file size is 10 MB');
            }
            const newFileName = Date.now() + '-' + (0, uuid_1.v4)();
            const fileExt = file.filename.split('.').pop();
            try {
                yield (0, sharp_1.default)(file.path).webp({ quality: 72 }).toFile(path_1.default.join(uploadPath, `webp_${newFileName}.webp`));
                if (deleteOriginal) {
                    yield (0, promises_1.unlink)(file.path);
                }
                return newFileName;
            }
            catch (error) {
                throw error;
            }
        }
        return null;
    });
}
exports.default = imageUpload;
