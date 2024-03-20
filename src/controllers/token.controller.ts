import jwt, { VerifyErrors } from 'jsonwebtoken'
import User from '@/models/user.model';
import { Request, Response } from 'express';
import authConfig from '@/config/auth';

export const handleRefreshtoken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies.jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const refreshToken = cookies.jwt;
  try {
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(refreshToken, authConfig.refresh_secret, (err: VerifyErrors | null, decoded: any | undefined) => {
      if (err || decoded.id !== user.id) {
        return res.status(403).json({ message: 'Invalid credentials' });
      }
      
      const accessToken = jwt.sign(
        { username: user.username, id: decoded.id },
        authConfig.access_secret,
        { expiresIn: authConfig.jwt_exrpiration });
      
      delete user['password'];
      delete user['refresh_token'];
      
      return res.status(200).json({ accessToken, refreshToken, user_info: user });
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
