var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/authorisation_middleware');
var wordController = require('../controllers/word_controller');
var dictionaryController = require('../controllers/dictionary_controller');

/* GET home page. */
router.get('/', function (req, res) {
        if (req.session.token) {
            res.redirect('/dashboard');
        }
        else {
            res.render('home', { title: 'Home' });
        }
});

router.get('/dashboard', checkAuth, dictionaryController.dashboard);

router.get('/register', function (req, res) {
    res.render('register', { title: 'Register' });
});

router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

router.get('/user/edit', checkAuth, function (req, res) {
    res.render('profileEdit', { title: 'Edit User', name: req.session.name, surname: req.session.surname, isAdmin: req.session.is_admin });
});

router.get('/learn', function (req, res) {
    res.render('learnSession', { title: 'Learn' });
});
router.get('/listen', checkAuth, function (req, res) {
  res.render('listenWord', { title: 'Listening Lesson' });
});
router.get('/say', checkAuth, function (req, res) {
  res.render('sayWord', { title: 'Listening Lesson' });
});

router.get('/404', checkAuth, function (req, res) {
  res.render('forOFor', { title: 'Error 404' });
});

router.get('/dict', checkAuth, function (req, res) {
    res.render('dictSearch', { title: 'Dictionary' });
});

router.get('/addDict', checkAuth, dictionaryController.addDict);

router.get('/dictSearch', checkAuth, function (req, res) {
  res.render('dictSearch', { title: 'Search Dictionary' });
});

router.get('/learnSession/:id', checkAuth, wordController.learnSession);

router.get('/editWord', checkAuth, function (req, res) {
  res.render('editWord', { title: 'Search Dictionary' });
});

router.get('/profileEdit', checkAuth, function (req, res) {
  res.render('profileEdit', { title: 'Search Dictionary' });
});

router.get('/reset', function (req, res) {
  res.render('resetPass', { title: 'Reset Password' });
});
module.exports = router;
