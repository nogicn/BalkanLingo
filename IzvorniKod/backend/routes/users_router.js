var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/users_controller');

// create login route
router.post('/login', user_controller.loginUser);

// create register route
router.post('/register', user_controller.createUser);

// create get all users route
router.get('/', user_controller.getAllUsers);
// import users controller

module.exports = router;
