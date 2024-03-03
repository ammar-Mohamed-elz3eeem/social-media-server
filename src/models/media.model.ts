import { UPLOAD_PATH } from "@/server";
import { sql } from "@/utils/db";
import imageUpload from "@/utils/uploader";
import { unlink } from "fs/promises";
import sharp from "sharp";
import uploadConfigs from "@/config/uploader";
import path from "path";
import { existsSync } from "fs";
import { logger } from "@/utils/logger";
import uploader from "@/config/uploader";

export default class Media {
  static async addMedia(src: string, postId: number): Promise<string | null> {
    try {
      const res = await sql(`INSERT INTO media (post_id, src) VALUES ($1, $2)`, [postId, src]);
      return src;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMedia (src: string) {
    try {
      const image = await sql(`SELECT * FROM media WHERE src=$1`, [src]);
      const imgPath = path.join(uploadConfigs.uploads_path, src);
      if (image.rows.length <= 0) {
        if (existsSync(imgPath)) {
          unlink(imgPath);
        }
        return true;
      } else {
        const deleted = await sql(`DELETE FROM media WHERE src=$1`, []);
        if (existsSync(imgPath)) {
          unlink(imgPath);
        }
        return true;
      }
    } catch (error: any) {
      logger.debug(error.message);
      throw error;
    }
  }

  static async getPostMedia (postId: string) {
    try {
      const res = await sql(`SELECT * FROM media WHERE post_id=$1`, [postId]);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }
}
