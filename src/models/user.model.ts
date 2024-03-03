import { TUser } from "@/types";
import { sql } from "@/utils/db";

export default class User {
  static async create(user: TUser): Promise<TUser | null> {
    try {
      const res = await sql("INSERT INTO users (first_name, last_name, username, email, password, date_of_birth, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [ user.first_name, user.last_name, user.username, user.email, user.password, user.dob, user.phone ]);
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateRefreshToken(refresh_token: string, cond: {where: {[field: string]: string}}) {
    try {
      const res = await sql(`UPDATE users SET refresh_token=$1 WHERE ${Object.keys(cond.where)[0]}=$2`, [refresh_token, Object.values(cond.where)[0]]);
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(cond: {where: {[field: string]: string}}) {
    try {
      const res = await sql(`SELECT * FROM users WHERE ${Object.keys(cond.where)[0]}=$1`, [Object.values(cond.where)[0]]);
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findOneById(id: string) {
    try {
      return this.findOne({where: {id: id}});
    } catch (error) {
      throw error;
    }
  }

  static async findAll(cond?: {where: {[field: string]: string}}) {
    try {
      let sqlCommand = `SELECT * FROM users`;
      let data = [];
      if (cond) {
        sqlCommand += ` WHERE ${Object.keys(cond.where)[0]}=$1`;
        data.push(Object.values(cond.where)[0]);
      }
      const res = await sql(sqlCommand, data);
      return res.rows.length > 0 && res.rows || null;
    } catch (error) {
      throw error;
    }
  }

  static async update(data: {[k: string]: string}, cond: {where: {[field: string]: string}}) {
    try {
      const updateKeys = Object.keys(data)
      let updateStr = "";
      let i;
      for (i = 0; i < updateKeys.length; i++) {
        updateStr += `${updateKeys[i]}=$${i + 1}`;
        if (i != updateKeys.length - 1) {
          updateStr += ", "
        }
      }
      const result = await sql(`UPDATE users SET ${updateStr} WHERE ${Object.keys(cond.where)[0]}=$${i+1} RETURNING *`, [
        ...Object.values(data),
        Object.values(cond.where)[0]
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(password: string, cond: {where: {[field: string]: string}}) {
    try {
      const result = await sql(`UPDATE users SET password=$1 WHERE ${Object.keys(cond.where)[0]}=$2`, [
        password,
        Object.values(cond.where)[0]
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      const res = await sql('DELETE FROM users WHERE id=$1', [id]);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
