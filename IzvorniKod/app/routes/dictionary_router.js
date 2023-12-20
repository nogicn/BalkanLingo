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
router.post('/checkWriting/:answer', checkAuth, wordController.checkAnswerWriting);
router.post('/checkListening/:answer', checkAuth, wordController.checkAnswerListening);

router.get('/addWord/:id', checkAuth, wordController.addWord);
router.post('/addWord/:id', checkAuth, wordController.addWord);

router.post('/fillWordData/:id', checkAuth,  wordController.fillWordData);
router.post('/fillSentenceData/:id', checkAuth, wordController.fillSentenceData);
router.post('/createPronunciation/:id', checkAuth,  wordController.createPronunciation);

router.get('/editWord/:id', checkAuth,  wordController.editWord);

router.post('/editWord/:id', checkAuth, wordController.editWord);

router.get('/deleteWord/:id', checkAuth, wordController.deleteWord);

router.post('/search/:id', checkAuth, wordController.searchWords);

router.get('/adminAddDict', checkAuth, dictionaryController.adminAddDict);

module.exports = router;