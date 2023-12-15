const db = require('../database/database');
const dictionaryModel = require('../models/dictionary_model');
const userModel = require('../models/user_model');
const activeQuestionModel = require('../models/active_question_model');
const wordModel = require('../models/word_model');
const translate = require('translate-google-api');
const axios = require('axios');
const ejs = require('ejs');
const ElevenLabs = require('elevenlabs-node');
const fs = require('fs-extra');



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



async function editWord(req, res) {
    // check if method is post or get
    if (req.method == "POST") {
        // get id from url
        let id = req.body.id;
        console.log(req.body)
        // get word from database
        let word = db.prepare(wordModel.getWordById).get({wordId:id});
        console.log(word);
        // get data from form
        let foreignWord = req.body.foreignWord;
        let foreignDescription = req.body.foreignDescription;
        let nativeWord = req.body.nativeWord;
        let nativeDescription = req.body.nativeDescription;
        let newPronunciation = req.body.pronunciation;
        if (word.pronunciation == undefined){
            word.pronunciation = "null";
        }

        

        if (newPronunciation != word.pronunciation &&  word.pronunciation != "null") {
            fs.unlinkSync("./public/pronunciation/"+ word.pronunciation);
        }

        /*if (newPronunciation != pronunciation && pronunciation == "null") {

            let pronunciationFileName = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) +".mp3";
            let pronunciationFilePath = "./public/pronunciation/" + pronunciationFileName;

            // Prepare options for fetch request
            const voice = new ElevenLabs({
                apiKey: "***REMOVED***", // Your API key
                voiceId: "pNInz6obpgDQGcFmaJgB",             // Default Voice ID
            });

            let resource = await voice.textToSpeech({
                // Required Parameters
                fileName:        pronunciationFilePath,                    // The name of your audio file
                textInput:       foreignWord,                // The text you wish to convert to speech
            
                // Optional Parameters
                stability:       0.5,                            // The stability for the converted speech
                similarityBoost: 0.5,                            // The similarity boost for the converted speech
                modelId:         "eleven_multilingual_v2",   // The ElevenLabs Model ID
                style:           1,                              // The style exaggeration for the converted speech
                speakerBoost:    true                            // The speaker boost for the converted speech
            }).then((res) => {
                console.log(res);
            });
            pronunciation = pronunciationFileName;
        }*/
        // update word in database
        let updateWord = db.prepare(wordModel.updateWord).run({wordId:id, foreignWord:foreignWord, foreignDescription:foreignDescription, nativeWord:nativeWord, nativeDescription:nativeDescription, pronunciation:newPronunciation});
        //console.log(updateWord);
        res.redirect('/dictionary/dictSearch/'+word.dictionary_id);
        
        
    }else{
        let id = req.params.id;
        // get word from database
        let word = db.prepare(wordModel.getWordById).get({wordId:id});
        // get dictionary from database
        let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:word.dictionary_id});
        //console.log(word);
        res.render('editWord', { title: 'Edit Word', word: word, dictionary: dictionary});
    }
   

}


async function addWord(req, res) {
    if (req.method == "POST") {
        // get data from form
        let foreignWord = req.body.foreignWord;
        let foreignDescription = req.body.foreignDescription;
        let nativeWord = req.body.nativeWord;
        let nativeDescription = req.body.nativeDescription;
        let dictionaryId = req.params.id;
        let pronunciationFileName = req.body.pronunciation;
        if (pronunciationFileName == "") {
            let pronunciationFileName = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) +".mp3";
            let pronunciationFilePath = "./public/pronunciation/" + pronunciationFileName;

            // Prepare options for fetch request
            const voice = new ElevenLabs({
                apiKey: "***REMOVED***", // Your API key
                voiceId: "pNInz6obpgDQGcFmaJgB",             // Default Voice ID
            });

            let resource = await voice.textToSpeech({
                // Required Parameters
                fileName:        pronunciationFilePath,                    // The name of your audio file
                textInput:       foreignWord,                // The text you wish to convert to speech
            
                // Optional Parameters
                stability:       0.5,                            // The stability for the converted speech
                similarityBoost: 0.5,                            // The similarity boost for the converted speech
                modelId:         "eleven_multilingual_v2",   // The ElevenLabs Model ID
                style:           1,                              // The style exaggeration for the converted speech
                speakerBoost:    true                            // The speaker boost for the converted speech
            }).then((res) => {
                console.log(res);
            });

        }
        // OVDJE MOZE BITI GRESKA, TREBA BITI ERROR HANDLING AKO VEC POSTOJI RIJEC U RIJECNIKU
        let word = db.prepare(wordModel.createWord).run({foreignWord:foreignWord, foreignDescription:foreignDescription, nativeWord:nativeWord, nativeDescription:nativeDescription, pronunciation:pronunciationFileName, dictionaryId:dictionaryId});
        res.redirect('/dictionary/dictSearch/'+dictionaryId);
        
    }else {
        let id = req.params.id;
        // get dictionary from database
        let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});
        res.render('addWord', { title: 'Add Word', dictionary: dictionary, word: {nativeWord : "", nativeDescription : "", foreignWord : "", foreignDescription : "", pronunciation : ""}});
    }
    
}

async function createPronunciation(req, res) {
    let word = req.body
    console.log(word);
    let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:req.params.id});
    let pronunciationFileName = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) +".mp3";
    let pronunciationFilePath = "./public/pronunciation/" + pronunciationFileName;

    // Prepare options for fetch request
    const voice = new ElevenLabs({
        apiKey: "***REMOVED***", // Your API key
        voiceId: "pNInz6obpgDQGcFmaJgB",             // Default Voice ID
    });

    let resource = await voice.textToSpeech({
        // Required Parameters
        fileName:        pronunciationFilePath,                    // The name of your audio file
        textInput:       req.body.foreignWord,                // The text you wish to convert to speech
    
        // Optional Parameters
        stability:       0.5,                            // The stability for the converted speech
        similarityBoost: 0.5,                            // The similarity boost for the converted speech
        modelId:         "eleven_multilingual_v2",   // The ElevenLabs Model ID
        style:           1,                              // The style exaggeration for the converted speech
        speakerBoost:    true                            // The speaker boost for the converted speech
    }).then((res) => {
        console.log(res);
    });
    word.pronunciation = pronunciationFileName;
    // generate html
    var html = await ejs.renderFile('views/partials/word.ejs', {word: word, dictionary: dictionary});
    //console.log(html);
    res.status(200).send(html);
}

async function fillSentenceData(req, res) {
    // get nativeDescription from body
    let nativeDescription = req.body.nativeDescription;
    // get dictionary id from url
    let id = req.params.id;
    // get dictionary from database
    let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});
    // get word from database
    let word = db.prepare(wordModel.getWordById).get({wordId:req.body.id});
    if (word == undefined) {
        word = {nativeWord : "", nativeDescription : "", foreignWord : "", foreignDescription : "", pronunciation : ""};
    }
    word.pronunciation = req.body.pronunciation;
    word.nativeWord = req.body.nativeWord;
    word.foreignWord = req.body.foreignWord;
    console.log(word);
    if (nativeDescription == "" || nativeDescription == undefined || nativeDescription == null) {
        res.status(404).json({text: "Error word empty"});
        return;
    }
    if (nativeDescription != word.nativeDescription){
        console.log("creating new description");
        word.nativeDescription = nativeDescription;
        console.log(word.nativeDescription);
        try {
            word.foreignDescription = await translate(word.nativeDescription, {to: dictionary.language});
            word.foreignDescription = word.foreignDescription[0]
            console.log(word);
        } catch (error) {
            res.status(404).json({text: "Error translation error"});
            return;
        }
        
        
    }
    // generate html
    var html = await ejs.renderFile('views/partials/word.ejs', {word: word, dictionary: dictionary});
    //console.log(html);
    res.status(200).send(html);
    
}

async function fillWordData(req, res) {
    // get word from body
    let inword = req.body.nativeWord;
    console.log(req.body)
    // get dictionary id from url
    let id = req.params.id;
    // get dictionary from database
    let dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});
    let word = db.prepare(wordModel.getWordById).get({wordId:req.body.id});
    console.log(word);
    if (word == undefined) {
        word = {nativeWord : "", nativeDescription : "", foreignWord : "", foreignDescription : "", pronunciation : ""};
    }
    console.log(word+" "+inword);
    if (inword == "" || inword == undefined || inword == null) {
        res.status(404).json({text: "Error word empty"});
        return;
    }
    
    let languageCode = dictionary.language;
    let extendedresult = "";
    let nativeDescription = req.body.nativeDescription;
    let example = "";
    if (inword != word.nativeWord){
        console.log("creating new word");
        word.nativeWord = inword;
        // get language code
        try {
        word.foreignWord =  await translate(inword, {to: "en"});
        word.foreignWord = word.foreignWord[0]
        console.log(word.foreignWord);
        }catch (error) {
            res.status(404).json({text: "Error translation error"+error});
            return;
        }
        try {
            extendedresult = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+word.foreignWord);
            // check if error
        } catch (error) {
            res.status(404).json({text: "Error word not found"});
            return;
        }
        
        for (var i = 0; i < extendedresult.data.length; i++) {
            for (var j = 0; j < extendedresult.data[i].meanings.length; j++) {
                if (extendedresult.data[i].meanings[j].definitions[0].example != undefined) {
                    example = extendedresult.data[i].meanings[j].definitions[0].example;
                    i = extendedresult.data.length;
                    break;
                }
            }
        }

            console.log("creating new description");
            word.foreignDescription = example;
            console.log(word.foreignDescription);
            try {
                word.nativeDescription = await translate(word.foreignDescription, {to: "hr"});
                word.nativeDescription = word.nativeDescription[0]
            } catch (error) {
                res.status(404).json({text: "Error translation error"});
                return;
            }
            console.log(word.nativeDescription);
            if (languageCode != "en"){
                try {
                    word.foreignWord = await translate(word.foreignWord, {to: languageCode});
                    word.foreignWord = word.foreignWord[0]
                    word.foreignDescription = await translate(word.foreignDescription, {to: languageCode});
                    word.foreignDescription = word.foreignDescription[0]
                    console.log(word);
                } catch (error) {
                    res.status(404).json({text: "Error translation error"});
                    return;
                }
            }
            
        
        }
    
    

    let pronunciation = req.body.pronunciation;
    
        if (pronunciation == "null" || pronunciation == "" || pronunciation == undefined) {
            console.log("creating new pronunciation");

        let pronunciationFileName = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) +".mp3";
        let pronunciationFilePath = "./public/pronunciation/" + pronunciationFileName;



        // Prepare options for fetch request
        const voice = new ElevenLabs({
            apiKey: "***REMOVED***", // Your API key
            voiceId: "pNInz6obpgDQGcFmaJgB",             // Default Voice ID
        });

        let resource = await voice.textToSpeech({
            // Required Parameters
            fileName:        pronunciationFilePath,                    // The name of your audio file
            textInput:       word.foreignWord,                // The text you wish to convert to speech
        
            // Optional Parameters
            stability:       0.5,                            // The stability for the converted speech
            similarityBoost: 0.5,                            // The similarity boost for the converted speech
            modelId:         "eleven_multilingual_v2",   // The ElevenLabs Model ID
            style:           1,                              // The style exaggeration for the converted speech
            speakerBoost:    true                            // The speaker boost for the converted speech
        }).then((res) => {
            console.log(res);
        });
        word.pronunciation = pronunciationFileName;
    }

    //console.log(word);
    // generate html
    console.log(word);
    var html = await ejs.renderFile('views/partials/word.ejs', {word: word, dictionary: dictionary});
    //console.log(html);
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

async function searchWords(req, res) {
    const id = req.params.id;
    const word = req.body.word;
    const allwords = db.prepare(wordModel.searchWordByDictionaryId).all({dictionaryId:id, word:word});
    console.log(allwords);
    const Dictionary = db.prepare(dictionaryModel.getDictionaryById).get({id:id});
    var html = await ejs.renderFile('views/partials/wordsList.ejs', { words: allwords });
    res.status(200).send(html);
}

module.exports = {
    dashboard,
    learnSession,
    checkAnswer,
    nextQuestion,
    editWord,
    deleteWord,
    addWord,
    fillWordData,
    searchWords,
    fillSentenceData,
    createPronunciation
}