"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../config/auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isLoggedIn(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, auth_1.default.access_secret, (err, decoded) => {
        console.log(token);
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' }); //invalid token
        }
        req.user = decoded.id;
        next();
    });
}
exports.default = isLoggedIn;
;
