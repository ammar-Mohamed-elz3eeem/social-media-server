import { sql } from "@/utils/db";
import Post from "./post.model";

export default class Likes {
  static async likedPost(postId: string, userId: string) {
    try {
      const post = await sql(`SELECT * FROM likes WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
      return post.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async like(postId: string, userId: string) {
    try {
      const post = await sql(`INSERT INTO likes (post_id, user_id) VALUES ($1,$2)`, [postId, userId]);
      return post;
    } catch (error) {
      throw error;
    }
  }

  static async dislike(postId: string, userId: string) {
    try {
      const post = await sql(`DELETE FROM likes WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
      return post;
    } catch (error) {
      throw error;
    }
  }
};
