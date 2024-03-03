import { TComment } from "@/types";
import { sql } from "@/utils/db";

export default class Comment {
  static async addComment(data: TComment): Promise<string | number> {
    try {
      const res = await sql(`INSERT INTO comments (post_id, content, created_by, parent_id) VALUES ($1,$2,$3,$4) RETURNING id`, [
        data.post_id, data.content, data.created_by, data.parent_id
      ]);
      return res.rows[0]['id'];
    } catch (error) {
      throw error;
    }
  }

  static async deleteComment(commentId: string): Promise<boolean> {
    try {
      const res = await sql(`DELETE FROM comments WHERE id=$1`, [commentId]);
      return res.rowCount! > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateComment(commentId: string, newContent: string): Promise<boolean> {
    try {
      const res = await sql(`UPDATE comments SET content=$1 WHERE id=$2`, [newContent, commentId]);
      return res.rowCount! > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(cond: {where: {[k:string]:string}}): Promise<TComment> {
    try {
      const res = await sql(`SELECT * FROM comments WHERE ${Object.keys(cond.where)[0]}=$1 LIMIT 1`, [Object.values(cond.where)[0]]);
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findOneById(commentId: string): Promise<TComment> {
    try {
      return await this.findOne({ where: { id: commentId } });
    } catch (error) {
      throw error;
    }
  }

  static async findMany(cond: {where: {[k:string]:string}}): Promise<TComment[]> {
    try {
      const res = await sql(`SELECT * FROM comments WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPostComments(postId: string) {
    try {
      const res = await this.findMany({where: {post_id: postId}});
      return res;
    } catch (error) {
      throw error;
    }
  }
};
