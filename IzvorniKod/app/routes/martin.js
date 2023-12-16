var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/authorisation_middleware');
var wordController = require('../controllers/word_controller');
var dictionaryController = require('../controllers/dictionary_controller');

/* GET home page. */
router.get('/', function (req, res) {
        res.render('listenWord', { title: 'Listening' });
});




module.exports = router;
