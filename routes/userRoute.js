const express = require('express');

const UserController = require('../controllers/userController');

const router = express.Router();

router.get(['/', '/login'], UserController.renderLoginPage);
router.get('/signup', UserController.renderSignupPage);
router.get('/home', UserController.renderHomePage);
router.get('/logout', UserController.renderLogoutAction);

router.post('/login', UserController.userLogin);
router.post('/signup', UserController.userSignup);

module.exports = router;