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

router.get('/reset', function (req, res) {
  res.render('resetPass', { title: 'Reset Password' });
});
/*
router.get('/', function(req, res, next) {
  res.render('addDictionary', { title: 'Express' });
});
*/

module.exports = router;
