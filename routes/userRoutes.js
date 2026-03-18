const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const { createUserValidation, updateUserValidation } = require('../validations/userValidation');

const router = express.Router();

router.use(auth);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', role(['admin']), createUserValidation, validate, userController.createUser);
router.put('/:id', updateUserValidation, validate, userController.updateUser);
router.delete('/:id', role(['admin']), userController.deleteUser);

module.exports = router;
