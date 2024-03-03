import { authenticateUser } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route("/")
  .post(authenticateUser)

export default router;