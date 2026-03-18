const sequelize = require('../config/database');
const User = require('./user');

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  User
};

module.exports = db;
