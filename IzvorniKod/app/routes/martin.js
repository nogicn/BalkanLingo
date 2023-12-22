var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/authorisation_middleware');
var wordController = require('../controllers/word_controller');
var dictionaryController = require('../controllers/dictionary_controller');

/* GET home page. */
router.get('/', function (req, res) {
        //res.render('sayWord', { title: 'Error' });
        res.render("forOFor", { status: 500, errorText: "Greska kod spremanja riječnika!", link: "/dashboard" })

});




module.exports = router;
