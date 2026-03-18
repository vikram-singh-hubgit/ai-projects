require('dotenv').config();

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql',
  storage: process.env.DB_STORAGE,
  logging: false
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig
};
