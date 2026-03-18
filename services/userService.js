const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const paginate = require('../utils/pagination');

const createUser = async (payload) => {
  const existing = await User.findOne({ where: { email: payload.email } });
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

  return user;
};

const getUsers = async (query) => {
  const { safePage, safeLimit, offset } = paginate(query.page, query.limit);
  const where = {};

  if (query.email) {
    where.email = { [Op.like]: `%${query.email}%` };
  }

  const { rows, count } = await User.findAndCountAll({
    where,
    limit: safeLimit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: rows,
    meta: {
      page: safePage,
      limit: safeLimit,
      total: count,
      totalPages: Math.ceil(count / safeLimit)
    }
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

const updateUser = async (id, payload, requester) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (requester.role !== 'admin' && requester.id !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  if (payload.email && payload.email !== user.email) {
    const existing = await User.findOne({ where: { email: payload.email } });
    if (existing) {
      throw new AppError('Email already exists', 409);
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  if (requester.role !== 'admin') {
    delete payload.role;
  }

  await user.update(payload);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  await user.destroy();
  return true;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
