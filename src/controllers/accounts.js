import jwt from 'jsonwebtoken';
import User from '../models/User';
import axios from 'axios';

export async function checkIfAlreadyExists(req, res) {
  const { email } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound)
    return res.json({ exists: true, message: 'El E-mail ya existe' });

  res.json({ exists: false });
}

export async function serverSignUp(req, res) {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound)
    return res.status(400).json({ message: 'El E-mail ya existe' });

  const newUser = new User({
    email,
    password: await User.encryptPassword(password),
  });

  try {
    await newUser.save();
  } catch (error) {
    if (error) res.json(error);
  }

  res.status(201).json({ message: 'Register successful' });
}

export async function serverSignIn(req, res) {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) return res.json({ message: 'User not found' });

  const matchPassword = await User.comparePassword(
    password,
    userFound.password
  );

  if (!matchPassword) return res.json({ message: 'Invalid password' });

  const token = buildToken(userFound._id);

  res.json({ success: true, token, message: 'LoggedIn' });
}

export async function facebookSignIn(req, res) {
  const { token, userId } = req.body;

  let response;

  try {
    response = await axios.get(
      `https://graph.facebook.com/v10.0/${userId}?access_token=${token}`
    );
  } catch (error) {
    if (error) res.status(401).json(error);
  }

  const facebookId = response.data.id;

  let user = await User.findOne({ facebookId });

  if (!user) {
    const newUser = new User({ facebookId });

    try {
      user = await newUser.save();
    } catch (error) {
      if (error) res.status(401).json(error);
    }
  }

  res.json({ token: buildToken(user._id), message: 'LoggedIn' });
}

export async function googleSignIn(req, res) {
  const { token, userId } = req.body;

  let response;

  try {
    response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/tokeninfo',
      {
        params: { access_token: token },
      }
    );
  } catch (error) {
    if (error) res.status(401).json(error);
  }

  const googleId = response.data.sub;

  let user = await User.findOne({ googleId });

  if (!user) {
    const newUser = new User({ googleId });

    try {
      user = await newUser.save();
    } catch (error) {
      if (error) res.status(401).json(error);
    }
  }

  res.json({ token: buildToken(user._id), message: 'LoggedIn' });
}

function buildToken(_id) {
  return jwt.sign({ _id }, 'mmoreno-app', {
    expiresIn: 604800, // 1w
  });
}
