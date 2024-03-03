import { sql } from "@/utils/db";
import Post from "./post.model";

export default class Saves {
  static async savedPost(postId: string, userId: string) {
    try {
      const post = await sql(`SELECT * FROM saves WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
      return post.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async noOfSaves(postId: string) {
    try {
      const saves = await sql(`SELECT user_id, post_id FROM saves WHERE post_id=$1`, [postId]);
      return saves;
    } catch (error) {
      throw error;
    }
  }

  static async save(postId: string, userId: string) {
    try {
      const post = await sql(`INSERT INTO saves (post_id, user_id) VALUES ($1,$2)`, [postId, userId]);
      return post;
    } catch (error) {
      throw error;
    }
  }

  static async unsave(postId: string, userId: string) {
    try {
      const post = await sql(`DELETE FROM saves WHERE post_id=$1 AND user_id=$2`, [postId, userId]);
      return post;
    } catch (error) {
      throw error;
    }
  }
};
