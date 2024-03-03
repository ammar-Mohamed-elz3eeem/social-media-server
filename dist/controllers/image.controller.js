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
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
function getImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { image } = req.params;
        const { width } = req.query;
        const widthNum = parseInt(width);
        if (typeof widthNum !== 'number' || widthNum <= 0) {
            return res.status(400).json({ message: 'invalid width for image' });
        }
        res.type('image/webp');
        (0, sharp_1.default)(path_1.default.resolve(uploader_1.default.uploads_path, `webp_${image}.webp`))
            .resize({ width: widthNum, withoutEnlargement: true })
            .pipe(res);
    });
}
exports.default = getImage;
;
