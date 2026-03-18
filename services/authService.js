const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const register = async (payload) => {
  const existing = await User.scope('withPassword').findOne({ where: { email: payload.email } });
  if (existing) {
    throw new AppError('Email already exists', 409);
  }

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashed,
    role: payload.role || 'user'
  });

  const token = generateToken(user);
  return { user, token };
};

const login = async (payload) => {
  const user = await User.scope('withPassword').findOne({ where: { email: payload.email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user);
  return { user, token };
};

module.exports = {
  register,
  login
};
