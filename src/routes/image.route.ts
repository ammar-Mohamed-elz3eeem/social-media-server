import getImage from '@/controllers/image.controller';
import express from 'express';

const router = express.Router();

router.route("/:image")
  .get(getImage);

export default router;