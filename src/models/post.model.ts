import { TPost, TUserPosts, UPost } from "@/types";
import { sql } from "@/utils/db";
import Media from "./media.model";
import { unlink } from "fs/promises";
import uploader from "@/config/uploader";
import path from "path";

export default class Post {
  static async addPost(data: TPost): Promise<TPost | null> {
    try {
      const res = await sql(`INSERT INTO posts (${Object.keys(data).join(", ")}) VALUES (${Object.keys(data).map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`, [...Object.values(data)]);
      const insertInUserPosts = await sql(`INSERT INTO user_posts (post_id, user_id, shared) VALUES ($1, $2, false)`, [
        res.rows[0].id,
        res.rows[0].created_by
      ]);
      return  res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getLikesCount(postId: string): Promise<{ likes: number }> {
    try {
      const res = await sql(`SELECT total_likes FROM posts WHERE id=$1`, [postId]);
      return  res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async editPost(data: UPost, cond: {where: { [field: string]: string }}) {
    const updateKeys = Object.keys(data)
      let updateStr = "";
      let i;
      for (i = 0; i < updateKeys.length; i++) {
        updateStr += `${updateKeys[i]}=$${i + 1}`;
        if (i != updateKeys.length - 1) {
          updateStr += ", "
        }
      }
    try {
      const res = await sql(`UPDATE posts SET ${updateStr} WHERE ${Object.keys(cond.where)[0]}=$${i+1} RETURNING *`, [
        ...Object.values(data),
        Object.values(cond.where)[0]
      ]);
      return res.rows[0];
    } catch (error: any) {
      throw error;
    }
  }

  static async findOne(cond: {where: {[field: string]: string}}): Promise<TPost> {
    try {
      const res = await sql(`SELECT * FROM posts WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findOneById(id: string): Promise<TPost> {
    try {
      return this.findOne({where: {id: id}});
    } catch (error) {
      throw error;
    }
  }

  static async getSitePosts() {
    try {
      const stmt = `SELECT u.first_name, u.last_name, u.username, u.avatar_url,
      p.id, p.content, p.created_at, p.total_likes, p.created_by as user_id, up.shared, up.posted_at FROM user_posts up 
      INNER JOIN users u ON up.user_id=u.id
      INNER JOIN posts p ON (up.post_id=p.id AND p.created_by=u.id) ORDER BY up.posted_at DESC`;
      const res = await sql(stmt, []);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPostLikes(postId: string | number): Promise<{user_id: number}[]> {
    try {
      const res = await sql(`SELECT user_id FROM likes WHERE post_id=$1`, [postId]);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPostSaves(postId: string | number): Promise<{user_id: number}[]> {
    try {
      const res = await sql(`SELECT user_id FROM saves WHERE post_id=$1`, [postId]);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPostShares(postId: string | number): Promise<number> {
    try {
      const res = await sql(`SELECT COUNT(*) FROM user_posts WHERE post_id=$1 AND shared=true`, [postId]);
      return res.rows[0]['count'];
    } catch (error) {
      throw error;
    }
  }

  static async deletePost(postId: string) {
    try {
      const res = await sql(`DELETE FROM posts WHERE id=$1`, [postId]);
      return res.rowCount! > 0;
    } catch (error) {
      throw error;
    }
  }

  static async sharePost(userId: string | number, postId: string | number) {
    try {
      const shared = await sql(`INSERT INTO user_posts (user_id, post_id, shared) VALUES ($1, $2, true)`, [userId, postId]);
      return shared;
    } catch (error) {
      throw error;
    }
  }

  static async getSharedPosts() {
    try {
      const posts = await sql(`SELECT * FROM user_posts uposts INNER JOIN posts p on uposts.post_id=p.id WHERE uposts.shared=true`, []);
      return posts;
    } catch (error) {
      throw error;
    }
  }

  static async getSharedPostsByUserId(userId: string) {
    try {
      const posts = await sql(`SELECT * FROM user_posts uposts INNER JOIN posts p on uposts.post_id=p.id WHERE user_id=$1 AND shared=true`,[userId]);
      return posts;
    } catch (error) {
      throw error;
    }
  }
}
