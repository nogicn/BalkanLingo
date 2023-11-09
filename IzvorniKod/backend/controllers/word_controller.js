const db = require('../database/database');
const dictionaryModel = require('../models/dictionary_model');
const userModel = require('../models/user_model');
const activeQuestionModel = require('../models/active_question_model');
const wordModel = require('../models/word_model');



function dashboard (req, res) {
    let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    //console.log(user);
    let dictionaries = [];
    if (req.session.is_admin) {
        dictionaries = db.prepare(dictionaryModel.getAllDictionaries).all();
        //console.log(dictionaries);
    }else {
        dictionaries = db.prepare(dictionaryModel.getDictionariesForUser).all({userId:user.id});
    }
    console.log(dictionaries);
    res.render('landingPage', { title: 'Express', dictionaries: dictionaries, is_admin: req.session.is_admin });
}

function learnSession(req, res) {
    let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    let active_question = db.prepare(activeQuestionModel.getActiveQuestion).get({userId:user.id});
    // get dictionary id from active question
    if (active_question !== undefined) {
        let dictionaryId = db.prepare(wordModel.getWordById).get({wordId:active_question.word_id});
        if (dictionaryId.dictionary_id != req.params.id) {
            db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:user.id});
            active_question = undefined;
        }
    }
    
    if (active_question === undefined) {
        
        // get 4 random words from dictionary
        let words = [];
        let numberOfWords = db.prepare(wordModel.getWordByDictionaryId).all({dictionaryId:req.params.id});
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
        let activeQuestion = db.prepare(activeQuestionModel.setActiveQuestion).run({userId:user.id, wordId:words[random].id, type:1});
        res.render('learnSession', { title: 'Learn', words: words, currentWord: words[random], dictionaryId:req.params.id});
        return;
    
    }else{
        
        let words = [];
        let activeWord = db.prepare(wordModel.getWordById).get({wordId:active_question.word_id});
        words.push(activeWord)
        let numberOfWords = db.prepare(wordModel.getWordByDictionaryId).all({dictionaryId:req.params.id});
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
    let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    // get active question
    let activeQuestion = db.prepare(activeQuestionModel.getActiveQuestion).get({userId:user.id});
    console.log(activeQuestion);
    console.log(db.prepare(activeQuestionModel.getActiveQuestion).all({userId:user.id}))
    // get dictionary id from active question
    let dictionaryId = db.prepare(wordModel.getWordById).get({wordId:activeQuestion.word_id});
    if (answer == activeQuestion.word_id) {
        // update active question
        let activeQuestion = db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:user.id});
        res.redirect('/learnSession/'+dictionaryId.dictionary_id);
    }else{
        res.send("Wrong answer");
    }
}

function nextQuestion(req, res) {
    // get user 
    let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    // remove active question
    let activeQuestion = db.prepare(activeQuestionModel.deleteActiveQuestion).run({userId:user.id});
    res.redirect('/learnSession/'+req.params.id);
    
}

module.exports = {
    dashboard,
    learnSession,
    checkAnswer,
    nextQuestion
}