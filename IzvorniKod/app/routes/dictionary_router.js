var express = require('express');
var router = express.Router();
var dictionaryController = require('../controllers/dictionary_controller');
const checkAdmin = require('../middleware/admin_authorisation_middleware');
const wordController = require('../controllers/word_controller');

router.get('/addDictionary',  dictionaryController.addDict);

router.get('/addDictionaryToUser/:id',  dictionaryController.addDictToUser);

router.get('/dictSearch/:id', checkAdmin,  dictionaryController.searchDictionary);

router.get('/removeDictionary/:id',  dictionaryController.removeDictionary);



router.post('/checkWord/:answer',  wordController.checkAnswer);
router.post('/checkWriting/:answer',  wordController.checkAnswerWriting);
router.post('/checkListening/:answer',  wordController.checkAnswerListening);

router.get('/addWord/:id', checkAdmin, wordController.addWord);
router.post('/addWord/:id', checkAdmin,  wordController.addWord);

router.post('/fillWordData/:id', checkAdmin,  wordController.fillWordData);
router.post('/fillSentenceData/:id', checkAdmin, wordController.fillSentenceData);
router.post('/createPronunciation/:id', checkAdmin,  wordController.createPronunciation);

router.get('/editWord/:id', checkAdmin,  wordController.editWord);

router.post('/editWord/:id', checkAdmin,  wordController.editWord);

router.get('/deleteWord/:id', checkAdmin,  wordController.deleteWord);

router.post('/search/:id', checkAdmin,  wordController.searchWords);

router.get('/adminAddDict', checkAdmin,  dictionaryController.adminAddDict);

router.get('/adminEditDict/:id', checkAdmin,  dictionaryController.adminAddDict);

router.post('/adminSaveDict', checkAdmin,  dictionaryController.adminSaveDict);

router.get('/adminLocales',  dictionaryController.adminLocales);

router.get('/editLocale/:id',  dictionaryController.editLocale);
router.get('/deleteLocale/:id',  dictionaryController.deleteLocale);
router.get('/addLocale',  dictionaryController.addLocale);
router.post('/saveLocale',  dictionaryController.saveLocale);

module.exports = router;