const express = require('express');

const auth = require('../middlewares/auth');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/tokenIsvalid').post(authController.validToken);

router.route('/user').get(auth, userController.getUser);
router.route('/upload').post(userController.uploadImage);
router.route('/updateUser').patch(auth, userController.updateUser);

// router.route('/').get(userController.getUser);

module.exports = router;
