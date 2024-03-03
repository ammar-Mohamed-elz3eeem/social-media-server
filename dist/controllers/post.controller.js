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
exports.removeComment = exports.editComment = exports.addComment = exports.sharePost = exports.savePost = exports.likePost = exports.getPosts = exports.getPost = exports.deletePost = exports.editPost = exports.addPost = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const uploader_1 = __importDefault(require("../config/uploader"));
const like_model_1 = __importDefault(require("../models/like.model"));
const media_model_1 = __importDefault(require("../models/media.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const save_model_1 = __importDefault(require("../models/save.model"));
const uploader_2 = __importDefault(require("../utils/uploader"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { created_by, content } = req.body;
    const images = req.files;
    if (!content) {
        return res.status(400).json({ message: 'post content is required' });
    }
    if (req.user != created_by) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const postAdded = yield post_model_1.default.addPost({ content, created_by });
        if (!postAdded) {
            return res.status(500).json({ message: "post can't be added" });
        }
        if (images) {
            images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
                const imageSrc = yield (0, uploader_2.default)(image, uploader_1.default.uploads_path, true);
                yield media_model_1.default.addMedia(imageSrc, parseInt(postAdded.id));
            }));
        }
        return res.status(201).json(Object.assign({ message: 'Post Created' }, postAdded));
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.addPost = addPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { created_by, content } = req.body;
    const { id } = req.params;
    const images = req.files;
    const post = yield post_model_1.default.findOneById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    if (post.content === content && (!images || images.length)) {
        return res.status(209).json({ message: 'No changes to post' });
    }
    try {
        const result = yield post_model_1.default.editPost({ content, }, { where: { id } });
        if (images) {
            for (let image of images) {
                const imageSrc = yield (0, uploader_2.default)(image, uploader_1.default.uploads_path, true);
                yield media_model_1.default.addMedia(imageSrc, parseInt(id));
            }
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: error.message });
    }
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const postImages = yield media_model_1.default.getPostMedia(id);
        postImages.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, promises_1.unlink)(path_1.default.join(uploader_1.default.uploads_path, image));
        }));
        const postsDeleted = yield post_model_1.default.deletePost(id);
        return res.status(200).json({ message: 'Post Deleted Successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deletePost = deletePost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        let post = yield post_model_1.default.findOneById(id);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        console.log("req.user", req.user);
        if (req.user) {
            post = Object.assign(Object.assign({}, post), { isLiked: yield like_model_1.default.likedPost(post === null || post === void 0 ? void 0 : post.id, req.user), total_saves: (yield save_model_1.default.noOfSaves(post === null || post === void 0 ? void 0 : post.id)).rows.length, isSaved: yield save_model_1.default.savedPost(post === null || post === void 0 ? void 0 : post.id, req.user), comments: yield comment_model_1.default.findMany({ where: { post_id: post === null || post === void 0 ? void 0 : post.id } }) });
        }
        else {
            post = Object.assign(Object.assign({}, post), { total_saves: (yield save_model_1.default.noOfSaves(post === null || post === void 0 ? void 0 : post.id)).rows.length, comments: yield comment_model_1.default.findMany({ where: { post_id: post === null || post === void 0 ? void 0 : post.id } }) });
        }
        const images = yield media_model_1.default.getPostMedia(post === null || post === void 0 ? void 0 : post.id);
        if (images && images.length) {
            post = Object.assign(Object.assign({}, post), { images: images.map(image => `http://localhost:${process.env.PORT}/images/${image.src}`) });
        }
        return res.status(200).json(Object.assign({}, post));
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getPost = getPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = yield post_model_1.default.getSitePosts();
        // if (req.user) {
        //   posts = await Promise.all(posts.map(async (post) => ({ 
        //     ...post,
        //     comments: await Comment.findMany({ where: { post_id: post?.id! } }),
        //     total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
        //     isLiked: await Likes.likedPost(post?.id!, req.user!),
        //     isSaved: await Saves.savedPost(post?.id!, req.user!)
        //   })));
        // } else {
        //   posts = await Promise.all(posts.map(async (post) => ({ 
        //     ...post,
        //     comments: await Comment.findMany({ where: { post_id: post?.id! } }),
        //     total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
        //   })));
        // }
        posts = yield Promise.all(posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            const images = yield media_model_1.default.getPostMedia(post === null || post === void 0 ? void 0 : post.id);
            if (req.user) {
                return Object.assign(Object.assign({}, post), { comments: yield comment_model_1.default.findMany({ where: { post_id: post === null || post === void 0 ? void 0 : post.id } }), total_saves: (yield save_model_1.default.noOfSaves(post === null || post === void 0 ? void 0 : post.id)).rows.length, isLiked: yield like_model_1.default.likedPost(post === null || post === void 0 ? void 0 : post.id, req.user), isSaved: yield save_model_1.default.savedPost(post === null || post === void 0 ? void 0 : post.id, req.user), images: images.map(image => `http://localhost:3000/images/${image.src}/?width=500`) });
            }
            else {
                return Object.assign(Object.assign({}, post), { comments: yield comment_model_1.default.findMany({ where: { post_id: post === null || post === void 0 ? void 0 : post.id } }), total_saves: (yield save_model_1.default.noOfSaves(post === null || post === void 0 ? void 0 : post.id)).rows.length, images: images.map(image => `http://localhost:3000/images/${image.src}/?width=500`) });
            }
        })));
        if (!posts || posts.length < 0) {
            return res.status(404).json({ message: 'no posts found' });
        }
        return res.status(200).json([...posts]);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getPosts = getPosts;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const { total_likes } = req.body;
    try {
        const alreadyLiked = yield like_model_1.default.likedPost(id, req.user);
        if (alreadyLiked) {
            const result = yield like_model_1.default.dislike(id, req.user);
            yield post_model_1.default.editPost({ total_likes: total_likes - 1 }, { where: { id } });
            return res.status(200).json(result);
        }
        else {
            const result = yield like_model_1.default.like(id, req.user);
            yield post_model_1.default.editPost({ total_likes: total_likes + 1 }, { where: { id } });
            return res.status(200).json(result);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
exports.likePost = likePost;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    try {
        const alreadySaved = yield save_model_1.default.savedPost(id, req.user);
        if (alreadySaved) {
            const result = yield save_model_1.default.unsave(id, req.user);
            return res.status(200).json(result);
        }
        else {
            const result = yield save_model_1.default.save(id, req.user);
            return res.status(200).json(result);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.savePost = savePost;
const sharePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const shared = yield post_model_1.default.sharePost(req.user, id);
        return res.status(200).json({ message: 'Post Shared successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
exports.sharePost = sharePost;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, parent_id } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'can\'t publish empty comment' });
    }
    try {
        const commentID = yield comment_model_1.default.addComment({
            post_id: id,
            content,
            parent_id,
            created_by: req.user,
        });
        return res.status(200).json(commentID);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.addComment = addComment;
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { content } = req.body;
    try {
        const result = yield comment_model_1.default.updateComment(comment_id, content);
        return res.status(200).json({ message: 'Comment updated successfully', updated: result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
exports.editComment = editComment;
const removeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    try {
        const result = yield comment_model_1.default.deleteComment(comment_id);
        return res.status(200).json({ message: 'Comment deleted successfully', deleted: result });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.removeComment = removeComment;
