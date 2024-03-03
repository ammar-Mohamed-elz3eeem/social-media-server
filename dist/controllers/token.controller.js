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
exports.handleRefreshtoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = __importDefault(require("../config/auth"));
const handleRefreshtoken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const refreshToken = cookies.jwt;
    try {
        const user = yield user_model_1.default.findOne({ where: { refresh_token: refreshToken } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        jsonwebtoken_1.default.verify(refreshToken, auth_1.default.refresh_secret, (err, decoded) => {
            if (err || decoded.id !== user.id) {
                return res.status(403).json({ message: 'Invalid credentials' });
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: user.username, id: decoded.id }, auth_1.default.access_secret, { expiresIn: auth_1.default.jwt_exrpiration });
            delete user['password'];
            delete user['refresh_token'];
            return res.status(200).json({ accessToken, refreshToken, user_info: user });
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.handleRefreshtoken = handleRefreshtoken;
