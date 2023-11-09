var express = require('express');
var router = express.Router();
var dictionaryController = require('../controllers/dictionary_controller');
const checkAuth = require('../middleware/authorisation_middleware');
const wordController = require('../controllers/word_controller');

router.get('/addDictionary', checkAuth, dictionaryController.getAllDictionaries);

router.get('/dictSearch/:id', checkAuth, dictionaryController.searchDictionary);

router.get('/removeDictionary/:id', checkAuth, dictionaryController.removeDictionary);

router.get('/nextQuestion', wordController.nextQuestion);

router.get('/checkWord/:answer', wordController.checkAnswer);

module.exports = router;