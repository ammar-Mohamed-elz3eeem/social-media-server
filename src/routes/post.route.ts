import { uploadsStorage } from "@/config/storage";
import { addComment, addPost, deletePost, editComment, editPost, getPost, getPosts, likePost, removeComment, savePost, sharePost } from "@/controllers/post.controller";
import isLoggedIn from "@/middlewares/isLogged.middleware";
import { verifyJWT } from "@/middlewares/verifyJWT.middleware";
import { Router } from "express";
import multer, { diskStorage } from "multer";

const router = Router();

router.route("/")
  .get(isLoggedIn, getPosts)
  .post(
    verifyJWT,
    multer({ storage: uploadsStorage }).array("images[]"),
    addPost
  );

router.route("/:id")
  .delete(verifyJWT, deletePost)
  .put(
    verifyJWT,
    multer({ storage: uploadsStorage }).array("images[]"),
    editPost
  )
  .get(isLoggedIn, getPost);

router.route("/:id/like")
  .post(verifyJWT, likePost);

router.route("/:id/save")
  .post(verifyJWT, savePost);

router.route("/:id/share")
  .post(verifyJWT, sharePost);

router.route("/:id/comment")
  .post(verifyJWT, addComment);

router.route("/:id/comment/:comment_id")
  .delete(verifyJWT, removeComment)
  .put(verifyJWT, editComment);

export default router;
