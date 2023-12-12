const db = require('../database/database');
const dictionaryModel = require('../models/dictionary_model');
const userModel = require('../models/user_model');
const activeQuestionModel = require('../models/active_question_model');
const wordModel = require('../models/word_model');
const translate = require('translate-google-api');
const axios = require('axios');
const ejs = require('ejs');


function dashboard (req, res) {
    //let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    //console.log(user);
    let dictionaries = [];
    if (req.session.is_admin) {
        dictionaries = db.prepare(dictionaryModel.getAllDictionaries).all();
        //console.log(dictionaries);
    }else {
        dictionaries = db.prepare(dictionaryModel.getDictionariesForUser).all({userId:req.session.user_id});
    }
    console.log(dictionaries);
    res.render('landingPage', { title: 'Express', dictionaries: dictionaries, is_admin: req.session.is_admin });
}

function learnSession(req, res) {
    //let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    //let user = req.session.user;
    let active_question = db.prepare(activeQuestionModel.getActiveQuestion).get({userId:req.session.user_id});
    // get dictionary id from active question
    if (active_question !== undefined) {
        let dictionaryId = db.prepare(wordModel.getWordById).get({wordId:active_question.word_id});
        if (dictionaryId.dictionary_id != req.params.id) {
            db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:req.session.user_id});
            active_question = undefined;
        }
    }
    
    if (active_question === undefined) {
        
        // get 4 random words from dictionary
        let words = [];
        let numberOfWords = db.prepare(wordModel.getWordByDictionaryId).all({dictionaryId:req.params.id});
        if (numberOfWords.length < 4) {
            res.send("Not enough words in dictionary");
            return;
        }
        console.log(numberOfWords);
        for (let i = 0; i < 4; i++) {
            // generate random number between 1 and number of words in dictionary
            let random = Math.floor(Math.random() * numberOfWords.length);
            let duplicate = false
            for (let j = 0; j < words.length; j++) {
                if (words[j].id == numberOfWords[random].id) {
                    duplicate = true;
                    break;
                }
            }
            if (duplicate) {
                i--;
                continue;
            }
            
            words.push(numberOfWords[random]);
        }
        // set random word as active question
        let random = Math.floor(Math.random() * 4);
        let activeQuestion = db.prepare(activeQuestionModel.setActiveQuestion).run({userId:req.session.user_id, wordId:words[random].id, type:1});
        res.render('learnSession', { title: 'Learn', words: words, currentWord: words[random], dictionaryId:req.params.id});
        return;
    
    }else{
        
        let words = [];
        let activeWord = db.prepare(wordModel.getWordById).get({wordId:active_question.word_id});
        words.push(activeWord)
        let numberOfWords = db.prepare(wordModel.getWordByDictionaryId).all({dictionaryId:req.params.id});
        if (numberOfWords.length < 4) {
            res.send("Not enough words in dictionary");
            return;
        }
        for (let i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * numberOfWords.length);
            let duplicate = false
            for (let j = 0; j < words.length; j++) {
                if (words[j].id == numberOfWords[random].id) {
                    duplicate = true;
                    break;
                }   
            }
            if (duplicate) {
                i--;
                continue;
            }
            words.push(numberOfWords[random]);
        }
        words.sort(() => Math.random() - 0.5);
        res.render('learnSession', { title: 'Learn', words: words, currentWord:activeWord, dictionaryId:req.params.id});

    }
    
}

function checkAnswer(req, res) {
    // get andwer from url
    let answer = req.params.answer;
    // get user id from session
    //let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    //let user = req.session.user;
    // get active question
    let activeQuestion = db.prepare(activeQuestionModel.getActiveQuestion).get({userId:req.session.user_id});
    console.log(activeQuestion);
    console.log(db.prepare(activeQuestionModel.getActiveQuestion).all({userId:req.session.user_id}))
    // get dictionary id from active question
    let dictionaryId = db.prepare(wordModel.getWordById).get({wordId:activeQuestion.word_id});
    if (answer == activeQuestion.word_id) {
        // update active question
        let activeQuestion = db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:req.session.user_id});
        res.redirect('/learnSession/'+dictionaryId.dictionary_id);
    }else{
        res.send("Wrong answer");
    }
}

function nextQuestion(req, res) {
    // get user 
    //let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    //let user = req.session.user;
    // remove active question
    let activeQuestion = db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:req.session.user_id});
    res.redirect('/learnSession/'+req.params.id);
    
}

function editWord(req, res) {
    // check if method is post or get
    if (req.method == "POST") {
        // get id from url
        let id = req.body.wordId;
        // get word from database
        let word = db.prepare(wordModel.getWordById).get({wordId:id});
        // get data from form
        let foreignWord = req.body.foreignWord;
        let foreignDescription = req.body.foreignDescription;
        let nativeWord = req.body.nativeWord;
        let nativeDescription = req.body.nativeDescription;
        let pronounciation = "aaaaaa";
        // update word
        let updateWord = db.prepare(wordModel.updateWord).run({wordId:id, foreignWord:foreignWord, foreignDescription:foreignDescription, nativeWord:nativeWord, nativeDescription:nativeDescription, pronounciation:pronounciation});
        res.redirect('/dictionary/dictSearch/'+word.dictionary_id);
        
    }else{
        let id = req.params.id;
        // get word from database
        let word = db.prepare(wordModel.getWordById).get({wordId:id});
        // get dictionary from database
        let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:word.dictionary_id});
        console.log(word);
        res.render('editWord', { title: 'Edit Word', word: word, dictionary: dictionary});
    }
   

}

function addWord(req, res) {
    if (req.method == "POST") {
        // get data from form
        let foreignWord = req.body.foreignWord;
        let foreignDescription = req.body.foreignDescription;
        let nativeWord = req.body.nativeWord;
        let nativeDescription = req.body.nativeDescription;
        let pronounciation = "aaaaaa";
        let dictionaryId = req.params.id;
        // insert word into database
        let word = db.prepare(wordModel.createWord).run({foreignWord:foreignWord, foreignDescription:foreignDescription, nativeWord:nativeWord, nativeDescription:nativeDescription, pronounciation:pronounciation, dictionaryId:dictionaryId});
        res.redirect('/dictionary/dictSearch/'+dictionaryId);
        
    }else {
        let id = req.params.id;
        // get dictionary from database
        let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});
        res.render('addWord', { title: 'Add Word', dictionary: dictionary, word: {nativeWord : "", nativeDescription : "", foreignWord : "", foreignDescription : "", pronounciation : ""}});
    }
    
}

async function fillWordData(req, res) {
    // get word from body
    let word = req.body.nativeWord;
    // get dictionary id from url
    let id = req.params.id;
    // get dictionary from database
    let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});

    // get language code
    let languageCode = dictionary.language;

    var foreignWord =  await translate(word, {to: "en"});
    try {
        var extendedresult = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+foreignWord[0]);
        // check if error
    } catch (error) {
        res.status(404).json({text: "Error word not found"});
        return;
    }

    
    
    console.log(extendedresult.data[0]);
    /*var audio = "";
    for (var i = 0; i < extendedresult.data[0].phonetics.length; i++) {
        if (extendedresult.data[0].phonetics[i].audio) {
        audio = extendedresult.data[0].phonetics[i].audio;
        break;
        }
    }*/
    // check if there is an example 
    var example = "";
    for (var i = 0; i < extendedresult.data.length; i++) {
        for (var j = 0; j < extendedresult.data[i].meanings.length; j++) {
        if (extendedresult.data[i].meanings[j].definitions[0].example != undefined) {
            example = extendedresult.data[i].meanings[j].definitions[0].example;
            i = extendedresult.data.length;
            break;
        }
        }
    }
    var nativeDescription = await translate(example, {to: "hr"});
    if (languageCode != "en"){
        example = await translate(nativeDescription[0], {to: languageCode});
        foreignWord = await translate(foreignWord[0], {to: languageCode});
    }

    // generate html
    var html = await ejs.renderFile('views/partials/word.ejs', {word: {nativeWord : word, nativeDescription : nativeDescription, foreignWord : foreignWord[0], foreignDescription : example, pronounciation : ""}, dictionary: dictionary});
    console.log(html);
    res.status(200).send(html);

}



function deleteWord(req, res) {
    // get id from url
    let id = req.params.id;
    // get id of dictionary
    let wordDictionaryId = db.prepare(wordModel.getWordById).get({wordId:id});
    // delete word from active question for all users
    let activeQuestion = db.prepare(activeQuestionModel.deleteActiveQuestionWordId).run({wordId:id});
    // delete word
    let word = db.prepare(wordModel.deleteWordById).run({wordId:id});
    res.redirect('/dictionary/dictSearch/'+wordDictionaryId.dictionary_id);
}

module.exports = {
    dashboard,
    learnSession,
    checkAnswer,
    nextQuestion,
    editWord,
    deleteWord,
    addWord,
    fillWordData
}