import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "@/models/user.model";
import { UserReq } from "@/types";
import imageUpload from "@/utils/uploader";
import uploadConfigs from "@/config/uploader";
import auth from "@/config/auth";
import uploader from "@/config/uploader";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(204).json({ message: 'No Users found' });
    }

    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req.body.id) {
    return res.status(400).json({ message: 'User id required.' });
  }

  try {
    const user = await User.findOne({ where: { id: req.body.id } });
    if (!user) {
      return res.status(204).json({ message: `User ID ${req.body.id} not found` });
    }

    const result = await User.delete(req.body.id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'User id required.' });
  }

  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: `User ID ${req.params.id} not found` });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: UserReq, res: Response) => {
  const avatar_url = req.file;
  let avatar;
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if(avatar_url) {
      avatar = await imageUpload(avatar_url, uploader.avatars_path, true);
    }
    delete req.body['avatar_url'];
    if (avatar) {
      const updatedUser = await User.update({...req.body, avatar_url: avatar}, {
        where: { id: req.user }
      });
    } else {
      const updatedUser = await User.update({...req.body}, {
        where: { id: req.user }
      });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserPassword = async (req: UserReq, res: Response) => {
  const { old_password, new_password, confirm_new_password } = req.body;
  if (!old_password || !new_password || !confirm_new_password) {
    return res.status(400).json({ message: 'all fields are required' });
  }
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (new_password !== confirm_new_password) {
    return res.status(400).json({ message: 'password & confirm password must be identical' })
  }
  const user = await User.findOne({where: {id: req.user}});
  if (!user) {
    return res.status(400).json({ message: 'user not found' });
  }
  if (!bcrypt.compareSync(old_password + process.env.BCRYPT_SALT, user.password)) {
    return res.status(400).json({ message: 'old password is wrong' });
  }
  try {
    const hashNewPassword = await bcrypt.hash(new_password + process.env.BCRYPT_SALT, 10);
    const updatedUser = await User.updatePassword(hashNewPassword, {
      where: { id: req.user }
    });
    res.status(200).json({ message: 'password updated successfully' });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ 'message': 'email and password are required.' });
  }

  try {
    const user = await User.findOne({where: { email }});
    if (!user) {
      return res.status(404).json({message: 'User Not Found'});
    }
    console.log(password + process.env.BCRYPT_SALT);
    console.log(bcrypt.compareSync(password + process.env.BCRYPT_SALT, user.password));
    const match = await bcrypt.compare(password + process.env.BCRYPT_SALT, user.password);
    if (!match) {
      return res.status(403).json({message: 'Invalid Credentials'});
    }

    const accessToken = jwt.sign({ email: user.email, id: user.id }, auth.access_secret, {
      expiresIn: auth.jwt_exrpiration
    });

    const refreshToken = jwt.sign({ id: user.id }, auth.refresh_secret, {
      expiresIn: auth.refresh_expiration
    });

    const result = await User.updateRefreshToken(refreshToken, {where: {id: user.id}});

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    delete user['password'];
    delete user['refresh_token'];

    return res.status(200).json({accessToken, refreshToken, user_info: { ...user } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const addNewUser = async (req: Request, res: Response) => {
  const { 
    first_name,
    last_name,
    username,
    email,
    password,
    dob,
    phone,
    confirm_password } = req.body;

  if (!username || !password || !email || !first_name || !last_name) {
    return res.status(400).json({ 'message': 'All Fields marked with * are required.' });
  }

  if (password !== confirm_password) {
    // console.log(password, confirm_password);
    return res.status(400).json({ 'message': 'Password & confirm password Fields must be identical' });
  }

  const duplicate = await User.findOne({ where: { username: username } });
  if (duplicate) {
    return res.status(409).json({ message: 'User Already Exist' }); //Conflict
  }

  try {
    const hashedPW = await bcrypt.hash(password + process.env.BCRYPT_SALT, 10);
    const result = await User.create({first_name, last_name, username, email, password: hashedPW, dob, phone});
    return res.status(201).json({ message: 'User ' + username + ' Created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const logUserOut = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log(req.cookies);
  if (!cookies?.jwt) {
    return res.status(200).json({ message: 'Loged out successfully', error: null });
  }
  try {
    const refreshToken = cookies.jwt;
    const user = await User.findOne({where: {refresh_token: refreshToken}});
    if (!user) {
      res.clearCookie('jwt', {httpOnly: true, sameSite: 'none'});
      return res.status(200).json({ message: 'Loged out successfully' });
    }

    const result = await User.updateRefreshToken('', { where: { id: user.id } });

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none'});
    return res.status(200).json({ message: 'Loged out successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
