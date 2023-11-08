var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/authorisation_middleware');
var indexController = require('../controllers/index_controller');

/* GET home page. */
router.get('/', checkAuth, function (req, res) {
    res.render('home', { title: 'Home' });
});

router.get('/dashboard', checkAuth, indexController.dashboard);

router.get('/register', function (req, res) {
    res.render('register', { title: 'Register' });
});

router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

router.get('/user/edit', checkAuth, function (req, res) {
    res.render('profileEdit', { title: 'Edit User', name: req.session.name, surname: req.session.surname });
});

router.get('/learn', checkAuth, function (req, res) {
    res.render('learnSession', { title: 'Learn' });
});

router.get('/dict', checkAuth, function (req, res) {
    res.render('dictSearch', { title: 'Dictionary' });
});

router.get('/addDict', checkAuth, indexController.addDict);

router.get('/dictSearch', function (req, res) {
  res.render('dictSearch', { title: 'Search Dictionary' });
});

router.get('/learnSession', function (req, res) {
  res.render('learnSession', { title: 'Search Dictionary' });
});

router.get('/editWord', function (req, res) {
  res.render('editWord', { title: 'Search Dictionary' });
});

router.get('/profileEdit', function (req, res) {
  res.render('profileEdit', { title: 'Search Dictionary' });
});

router.get('/reset', function (req, res) {
  res.render('resetPass', { title: 'Reset Password' });
});

router.get('/addDictionary', function(req, res, next) {
  res.render('addDictionary', { title: 'Add Dictionary' });
});


module.exports = router;
