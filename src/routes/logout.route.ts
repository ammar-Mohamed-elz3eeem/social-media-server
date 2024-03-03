import { authenticateUser, logUserOut } from "@/controllers/user.controller";
import { verifyJWT } from "@/middlewares/verifyJWT.middleware";
import { Router } from "express";

const router = Router();

router.route("/")
  .get(logUserOut)

export default router;