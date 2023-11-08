var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/users_controller');
var checkAuth = require('../middleware/authorisation_middleware');

// create login route
router.post('/login', user_controller.loginUser);

// create register route
router.post('/register', user_controller.createUser);

// create logout route
router.get('/logout', checkAuth, user_controller.logoutUser);

// create get all users route
router.get('/', checkAuth, user_controller.getAllUsers);

// import users controller
router.post('/edit', checkAuth, user_controller.editUser);

// reset password
router.post('/reset', user_controller.resetPwd);

module.exports = router;
