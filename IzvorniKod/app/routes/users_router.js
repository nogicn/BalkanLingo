var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/users_controller');
var checkAuth = require('../middleware/authorisation_middleware');
var checkAdmin = require('../middleware/admin_authorisation_middleware');
// create login route
router.post('/login', user_controller.loginUser);

// create register route
router.post('/register', user_controller.createUser);

// create logout route
router.get('/logout', checkAuth, user_controller.logoutUser);

// import users controller
router.post('/edit', checkAuth, user_controller.editUser);

// reset password
router.post('/reset', user_controller.resetPwd);

router.post('/createPass', user_controller.createPass);

router.get('/getUsers', checkAdmin, user_controller.searchUsers);

router.post('/getUsers', checkAdmin, user_controller.listUsers);

router.post('/setAdmin/:id', checkAdmin, user_controller.setAdmin);

module.exports = router;
