import imageConfig from "@/config/uploader";
import { unlink } from "fs/promises";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import path from "path";
import { UPLOAD_PATH } from "@/server";
import uploader from "@/config/uploader";

export default async function imageUpload(file: any, uploadPath: string, deleteOriginal = false): Promise<string | null> {
  console.log("file.path", file.path);
  if (file) {
    if (!imageConfig.allowed_types.includes(file.mimetype)) {
      await unlink(file.path);
      throw new Error('Not Allowed image type');
    }
    if (file.size >= 1024 * 1024 * 10) {
      await unlink(file.path);
      throw new Error('maximum file size is 10 MB');
    }
    const newFileName = Date.now() + '-' + uuid();
    const fileExt = file.filename.split('.').pop();
    try {
      await sharp(file.path).webp({quality: 72}).toFile(path.join(uploadPath, `webp_${newFileName}.webp`));
      if (deleteOriginal) {
        await unlink(file.path);
      }
      return newFileName;
    } catch (error) {
      throw error;
    }
  }
  return null;
}
