module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Email already exists' });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({ message: err.errors[0]?.message || 'Validation error' });
  }

  return res.status(status).json({ message });
};
