"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../config/storage");
const post_controller_1 = require("../controllers/post.controller");
const isLogged_middleware_1 = __importDefault(require("../middlewares/isLogged.middleware"));
const verifyJWT_middleware_1 = require("../middlewares/verifyJWT.middleware");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
router.route("/")
    .get(isLogged_middleware_1.default, post_controller_1.getPosts)
    .post(verifyJWT_middleware_1.verifyJWT, (0, multer_1.default)({ storage: storage_1.uploadsStorage }).array("images[]"), post_controller_1.addPost);
router.route("/:id")
    .delete(verifyJWT_middleware_1.verifyJWT, post_controller_1.deletePost)
    .put(verifyJWT_middleware_1.verifyJWT, (0, multer_1.default)({ storage: storage_1.uploadsStorage }).array("images[]"), post_controller_1.editPost)
    .get(isLogged_middleware_1.default, post_controller_1.getPost);
router.route("/:id/like")
    .post(verifyJWT_middleware_1.verifyJWT, post_controller_1.likePost);
router.route("/:id/save")
    .post(verifyJWT_middleware_1.verifyJWT, post_controller_1.savePost);
router.route("/:id/share")
    .post(verifyJWT_middleware_1.verifyJWT, post_controller_1.sharePost);
router.route("/:id/comment")
    .post(verifyJWT_middleware_1.verifyJWT, post_controller_1.addComment);
router.route("/:id/comment/:comment_id")
    .delete(verifyJWT_middleware_1.verifyJWT, post_controller_1.removeComment)
    .put(verifyJWT_middleware_1.verifyJWT, post_controller_1.editComment);
exports.default = router;
