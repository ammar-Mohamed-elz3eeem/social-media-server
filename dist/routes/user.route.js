"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../config/storage");
const token_controller_1 = require("../controllers/token.controller");
const user_controller_1 = require("../controllers/user.controller");
const verifyJWT_middleware_1 = require("../middlewares/verifyJWT.middleware");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
router.route("/")
    .post(user_controller_1.addNewUser)
    .get(verifyJWT_middleware_1.verifyJWT, user_controller_1.getAllUsers);
router.route("/me")
    .get(token_controller_1.handleRefreshtoken);
router.route("/:id")
    .put(verifyJWT_middleware_1.verifyJWT, (0, multer_1.default)({ storage: storage_1.avatarStorage }).single('avatar_url'), user_controller_1.updateUser)
    .delete(verifyJWT_middleware_1.verifyJWT, user_controller_1.deleteUser)
    .get(user_controller_1.getUser);
router.route("/:id/password")
    .put(verifyJWT_middleware_1.verifyJWT, user_controller_1.updateUserPassword);
exports.default = router;
