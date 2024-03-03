import uploader from "@/config/uploader";
import { Request, Response } from "express";
import path from "path";
import sharp from "sharp";

export default async function getImage(req: Request, res: Response) {
  const { image } = req.params;
  const { width } = req.query as unknown as { width: string };
  const widthNum = parseInt(width);
  if (typeof widthNum !== 'number' || widthNum <= 0) {
    return res.status(400).json({ message: 'invalid width for image' })
  }
  res.type('image/webp');
  sharp(path.resolve(uploader.uploads_path, `webp_${image}.webp`))
      .resize({width: widthNum, withoutEnlargement: true})
      .pipe(res);
};