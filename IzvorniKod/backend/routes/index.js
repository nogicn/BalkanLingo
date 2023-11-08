var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.token) //ako je korisnik ulogiran
    res.render('landingPage', { title: 'Express' });
  else
    res.render('home', { title: 'Home Page' });
});

router.get('/register', function (req, res) {
    res.render('register', { title: 'Register' });
});

router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

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
