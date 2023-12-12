var express = require('express');
var router = express.Router();
var dictionaryController = require('../controllers/dictionary_controller');
const checkAuth = require('../middleware/authorisation_middleware');
const wordController = require('../controllers/word_controller');

router.get('/addDictionary', checkAuth, dictionaryController.getAllDictionaries);

router.get('/addDictionaryToUser/:id', checkAuth, dictionaryController.addDictToUser);

router.get('/dictSearch/:id', checkAuth, dictionaryController.searchDictionary);

router.get('/removeDictionary/:id', checkAuth, dictionaryController.removeDictionary);

router.get('/nextQuestion/:id', checkAuth, wordController.nextQuestion);

router.get('/checkWord/:answer', checkAuth, wordController.checkAnswer);

router.get('/addWord/:id', checkAuth, wordController.addWord);
router.post('/addWord/:id', checkAuth, wordController.addWord);

router.post('/fillWordData/:id', checkAuth, wordController.fillWordData);

router.get('/editWord/:id', checkAuth, wordController.editWord);

router.post('/editWord/:id', checkAuth, wordController.editWord);

router.get('/deleteWord/:id', checkAuth, wordController.deleteWord);



module.exports = router;