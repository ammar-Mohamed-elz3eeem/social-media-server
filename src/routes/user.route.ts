import { avatarStorage } from "@/config/storage";
import { handleRefreshtoken } from "@/controllers/token.controller";
import { addNewUser, deleteUser, getAllUsers, getUser, updateUser, updateUserPassword } from "@/controllers/user.controller";
import { verifyJWT } from "@/middlewares/verifyJWT.middleware";
import { Router } from "express";
import multer from "multer";

const router = Router();

router.route("/")
  .post(addNewUser)
  .get(verifyJWT, getAllUsers);

router.route("/me")
  .get(handleRefreshtoken);

router.route("/:id")
  .put(verifyJWT, multer({storage: avatarStorage}).single('avatar_url'), updateUser)
  .delete(verifyJWT, deleteUser)
  .get(getUser);

router.route("/:id/password")
  .put(verifyJWT, updateUserPassword);

export default router;