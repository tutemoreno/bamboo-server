import jwt from 'jsonwebtoken';

import User from '../models/User';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  let decoded;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    decoded = jwt.verify(token, 'mmoreno-app');
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(decoded._id);

  if (!user) return res.status(401).json({ message: 'User not found' });

  req.AUTH = {
    USER_ID: user._id,
  };

  next();
};
