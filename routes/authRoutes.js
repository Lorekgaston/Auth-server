const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/tokenIsvalid').post(authController.validToken);

// router.route('/updateUser').patch(auth, userController.updateUser);

module.exports = router;
