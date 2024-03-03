import { Request } from "express";

export type TUser = {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  dob?: Date;
  id?: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
  refresh_token?: string;
}

export type TPost = {
  content: string;
  created_by?: string;
  id?: string;
  created_at?: Date;
  total_likes?: string | number;
  total_saves?: string | number;
  images?: string[];
}

export type UPost = {
  content?: string;
  created_by?: string;
  id?: string;
  created_at?: Date;
  total_likes?: string | number;
  images?: string[];
}

export interface UserReq extends Request {
  user?: string
}

export type TUserPosts = TUser & TPost & {
  user_id?: string;
};

export type TComment = {
  id?: string | number;
  post_id?: string | number;
  content?: string;
  created_by?: string | number;
  created_at?: Date;
  parent_id?: string | number;
}
