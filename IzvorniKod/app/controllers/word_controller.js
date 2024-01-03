const db = require("../database/database");
const dictionaryModel = require("../models/dictionary_model");
const userModel = require("../models/user_model");
const activeQuestionModel = require("../models/active_question_model");
const userWordModel = require("../models/user_word_model");
const wordModel = require("../models/word_model");
const translate = require("translate-google-api");
const axios = require("axios");
const ejs = require("ejs");
const fs = require("fs-extra");
var createPronunciationFunc = require("../middleware/pronunciation_middleware");
const LanguageModel = require("../models/language_model");

function learnSession(req, res) {
  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  // check if user has any user_words
  let user_words = db
    .prepare(userWordModel.getViableWordsForUserForDictionary)
    .all({ userId: req.session.user_id, dictionaryId: req.params.id });

  // get dictionary from database
  let dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: req.params.id });
  //check if active word dict is same as dictionary

    
    let words = db
      .prepare(wordModel.getAllWordsNotInUserWord)
      .all({ userId: req.session.user_id });
      // get all words for this dictionary that are not in user_words

    // create user_word for all words
    for (let i = 0; i < words.length; i++) {
      let date = new Date();
      date = Math.floor(date.getTime() / 1000);
      db.prepare(userWordModel.createUserWord).run({
        lastAnswered: new Date("1970-01-01").toISOString(),
        delay: 0,
        active: 1,
        wordId: words[i].id,
        userId: req.session.user_id,
      });
    }
  

  // check if active question word is from this dictionary

  if (active_question !== undefined) {
    let activeWord = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    if (activeWord.dictionary_id != req.params.id) {
      //reset active question
      db.prepare(activeQuestionModel.deleteActiveQuestion).run({
        userId: req.session.user_id,
      });
      learnSessionForeignNative(req, res);
    }

    switch (active_question.type) {
      case 1:
        learnSessionForeignNative(req, res);
        break;
      case 2:
        learnSessionNativeForeign(req, res);
        break;
      case 3:
        learnSessionWriting(req, res);
        break;
      case 4:
        learnSessionPronunciation(req, res);
        break;
      default:
        learnSessionNativeForeign(req, res);
        break;
    }
  } else {
    learnSessionForeignNative(req, res);
  }
}

function learnSessionForeignNative(req, res) {
  //console.log("foreign native");
  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  // get dictionary id from active question

  if (active_question === undefined) {
    // get 4 random words from dictionary
    let words = [];

    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionary)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    if (numberOfWords.length < 4) {
      res.render("forOFor", {
        status: "",
        errorText: "Naučene su sve riječi za danas",
        link: "/dashboard",
      });
      return;
    }
    for (let i = 0; i < 4; i++) {
      // generate random number between 1 and number of words in dictionary
      let random = Math.floor(Math.random() * numberOfWords.length);
      let duplicate = false;
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
    let activeQuestion = db
      .prepare(activeQuestionModel.setActiveQuestion)
      .run({ userId: req.session.user_id, wordId: words[random].id, type: 1 });

    // swap foreign and native word and both descriptions
    for (let i = 0; i < words.length; i++) {
      let temp = words[i].foreignWord;
      words[i].foreignWord = words[i].nativeWord;
      words[i].nativeWord = temp;
      temp = words[i].foreignDescription;
      words[i].foreignDescription = words[i].nativeDescription;
      words[i].nativeDescription = temp;
    }

    res.render("learnSession", {
      title: "Learn",
      words: words,
      currentWord: words[random],
      dictionaryId: req.params.id,
      next: 2,
    });
    return;
  } else {
    let words = [];
    let activeWord = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    words.push(activeWord);
    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionaryWhereItIsntActiveQuestion)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    //console.log(numberOfWords.length)
    if (numberOfWords.length < 3) {
      res.render("forOFor", {
        status: "",
        errorText: "Naučene su sve riječi za danas",
        link: "/dashboard",
      });
      return;
    }
    for (let i = 0; i < 3; i++) {
      let random = Math.floor(Math.random() * numberOfWords.length);
      let duplicate = false;
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
    for (let i = 0; i < words.length; i++) {
      let temp = words[i].foreignWord;
      words[i].foreignWord = words[i].nativeWord;
      words[i].nativeWord = temp;
      temp = words[i].foreignDescription;
      words[i].foreignDescription = words[i].nativeDescription;
      words[i].nativeDescription = temp;
    }

    res.render("learnSession", {
      title: "Learn",
      words: words,
      currentWord: activeWord,
      dictionaryId: req.params.id,
      next: 2,
    });
    return;
  }
}

function learnSessionNativeForeign(req, res) {
  //console.log("native foreign");
  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  if (active_question === undefined) {
    // get 4 random words from dictionary
    let words = [];
    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionary)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    if (numberOfWords.length < 4) {
      //res.send("Not enough words in dictionary native foreign 1");
      res.render("forOFor", {
        status: "",
        errorText: "Naučene su sve riječi za danas",
        link: "/dashboard",
      });
      return;
    }
    for (let i = 0; i < 4; i++) {
      // generate random number between 1 and number of words in dictionary
      let random = Math.floor(Math.random() * numberOfWords.length);
      let duplicate = false;
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
    let activeQuestion = db
      .prepare(activeQuestionModel.setActiveQuestion)
      .run({ userId: req.session.user_id, wordId: words[random].id, type: 2 });

    res.render("learnSession", {
      title: "Learn",
      words: words,
      currentWord: words[random],
      dictionaryId: req.params.id,
      next: 3,
    });
    return;
  } else {
    let words = [];
    let activeWord = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    words.push(activeWord);
    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionaryWhereItIsntActiveQuestion)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    if (numberOfWords.length < 3) {
      res.render("forOFor", {
        status: "",
        errorText: "Naučene su sve riječi za danas",
        link: "/dashboard",
      });
      return;
    }
    for (let i = 0; i < 3; i++) {
      let random = Math.floor(Math.random() * numberOfWords.length);
      let duplicate = false;
      
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
    res.render("learnSession", {
      title: "Learn",
      words: words,
      currentWord: activeWord,
      dictionaryId: req.params.id,
      next: 3,
    });
    return;
  }
}

function learnSessionWriting(req, res) {
  //console.log("writing");
  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  if (active_question === undefined) {
    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionary)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    if (numberOfWords.length < 2) {
      res.render("forOFor", {
        status: "",
        errorText: "Naučene su sve riječi za danas",
        link: "/dashboard",
      });
    }
    let random = Math.floor(Math.random() * numberOfWords.length);
    let activeQuestion = db.prepare(activeQuestionModel.setActiveQuestion).run({
      userId: req.session.user_id,
      wordId: numberOfWords[random].id,
      type: 3,
    });
    res.render("writeWord", {
      title: "Learn",
      word: numberOfWords[random],
      dictionaryId: req.params.id,
      next: 4,
    });
  } else {
    let activeWord = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    let word = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    res.render("writeWord", {
      title: "Learn",
      word: word,
      dictionaryId: req.params.id,
      next: 4,
    });
  }
}

function learnSessionPronunciation(req, res) {
  //console.log("pronunciation");
  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  if (active_question === undefined) {
    let numberOfWords = db
      .prepare(userWordModel.getViableWordsForUserForDictionary)
      .all({ userId: req.session.user_id, dictionaryId: req.params.id });
    if (numberOfWords.length == 0) {
      res.send("Not enough words in dictionary pronunciation");
      return;
    }
    let random = Math.floor(Math.random() * numberOfWords.length);
    let activeQuestion = db.prepare(activeQuestionModel.setActiveQuestion).run({
      userId: req.session.user_id,
      wordId: numberOfWords[random].id,
      type: 4,
    });
    res.render("sayWord", {
      title: "Learn",
      word: numberOfWords[random],
      dictionaryId: req.params.id,
      next: 1,
    });
  } else {
    let activeWord = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    let word = db
      .prepare(wordModel.getWordById)
      .get({ wordId: active_question.word_id });
    res.render("sayWord", {
      title: "Learn",
      word: word,
      dictionaryId: req.params.id,
      next: 1,
    });
  }
}
function moveToNextWordCorrect(req, res) {
  let activeQuestion = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  // get dictionary id from active question and deactivate old word
  let dictionaryId = db
    .prepare(wordModel.getWordById)
    .get({ wordId: activeQuestion.word_id });
  //let userWord = db.prepare(userWordModel.deactivateWordForUser).run({userId:req.session.user_id, wordId:activeQuestion.word_id});
  // get delay for word
  let delay = db
    .prepare(userWordModel.getDelayForWordForUser)
    .get({ userId: req.session.user_id, wordId: activeQuestion.word_id });
  // add a delay to the word
  //console.log(delay);
  let userWord = db.prepare(userWordModel.setNewDelayForUser).run({
    userId: req.session.user_id,
    wordId: activeQuestion.word_id,
    delay: delay.delay + 1,
  });
  // update last answered
  let updateLastAnswered = db.prepare(userWordModel.updateLastAnswered).run({
    userId: req.session.user_id,
    wordId: activeQuestion.word_id,
    lastAnswered: new Date().toISOString(),
  });

  // get random word
  let numberOfWords = db
    .prepare(userWordModel.getViableWordsForUserForDictionary)
    .all({
      userId: req.session.user_id,
      dictionaryId: dictionaryId.dictionary_id,
    });
  if (numberOfWords.length == 0) {
    //res.send("Not enough words in dictionary check answer");
    res.render("forOFor", {
      status: "",
      errorText: "Naučene su sve riječi za sad",
      link: "/dashboard",
    });

    return;
  }
  let random = Math.floor(Math.random() * numberOfWords.length);

  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  // delete active question
  db.prepare(activeQuestionModel.deleteActiveQuestion).run({
    userId: req.session.user_id,
  });
  // set new active question

  let activeQuestionNew = db
    .prepare(activeQuestionModel.setActiveQuestion)
    .run({
      userId: req.session.user_id,
      wordId: numberOfWords[random].id,
      type: active_question.type,
    });
  // increase ActiveQuestionType

  increaseActiveQuestionType = db
    .prepare(activeQuestionModel.increaseActiveQuestionType)
    .run({ userId: req.session.user_id });
  //req.params.id = dictionaryId.dictionary_id;
  //res.redirect("/learnSession/" + req.params.id);
}

function moveToNextQuestion(req, res) {
  let activeQuestion = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  // get dictionary id from active question and deactivate old word
  let dictionaryId = db
    .prepare(wordModel.getWordById)
    .get({ wordId: activeQuestion.word_id });
  //let userWord = db.prepare(userWordModel.deactivateWordForUser).run({userId:req.session.user_id, wordId:activeQuestion.word_id});
  // get delay for word
  let delay = db
    .prepare(userWordModel.getDelayForWordForUser)
    .get({ userId: req.session.user_id, wordId: activeQuestion.word_id });
  // add a delay to the word
  //console.log(delay);
  let userWord = db.prepare(userWordModel.setNewDelayForUser).run({
    userId: req.session.user_id,
    wordId: activeQuestion.word_id,
    delay: 0,
  });
  // update last answered
  let updateLastAnswered = db.prepare(userWordModel.updateLastAnswered).run({
    userId: req.session.user_id,
    wordId: activeQuestion.word_id,
    lastAnswered: new Date().toISOString(),
  });
  if (updateLastAnswered.changes == 0) {
    res.render("forOFor", {
      status: 404,
      errorText: "Greska kod postavljanja zadnjeg odgovora",
      link: "/dashboard",
    });
  }
  // get random word
  let numberOfWords = db
    .prepare(userWordModel.getViableWordsForUserForDictionary)
    .all({
      userId: req.session.user_id,
      dictionaryId: dictionaryId.dictionary_id,
    });
  if (numberOfWords.length == 0) {
    //res.send("Not enough words in dictionary check answer");
    res.render("forOFor", {
      status: "",
      errorText: "Naučene su sve riječi za sad",
      link: "/dashboard",
    });

    return;
  }
  let random = Math.floor(Math.random() * numberOfWords.length);

  let active_question = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });

  // delete active question
  db.prepare(activeQuestionModel.deleteActiveQuestion).run({
    userId: req.session.user_id,
  });
  // set new active question

  let activeQuestionNew = db
    .prepare(activeQuestionModel.setActiveQuestion)
    .run({
      userId: req.session.user_id,
      wordId: numberOfWords[random].id,
      type: active_question.type,
    });
  if (activeQuestionNew.changes == 0) {
    res.render("forOFor", {
      status: 404,
      errorText: "Greska kod postavljanja nove aktivne riječi",
      link: "/dashboard",
    });
  }
  // increase ActiveQuestionType

  increaseActiveQuestionType = db
    .prepare(activeQuestionModel.increaseActiveQuestionType)
    .run({ userId: req.session.user_id });
}

async function checkAnswer(req, res) {
  // get andwer from url
  let answer = req.params.answer;
  // get active question
  let activeQuestion = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  if (activeQuestion === undefined) {
    res.redirect("/dashboard");
    return;
  }
  let word = db
    .prepare(wordModel.getWordById)
    .get({ wordId: activeQuestion.word_id });
  // get dictionary id from active question
  let dictionaryId = db
    .prepare(wordModel.getWordById)
    .get({ wordId: activeQuestion.word_id });
    if (answer == activeQuestion.word_id) {
    let type = db
      .prepare(activeQuestionModel.getActiveQuestion)
      .get({ userId: req.session.user_id });
    if(type.type == 1){
      // swap foreign and native word and both descriptions
    
      let temp = word.foreignWord;
      word.foreignWord = word.nativeWord;
      word.nativeWord = temp;
      temp = word.foreignDescription;
      word.foreignDescription = word.nativeDescription;
      word.nativeDescription = temp;
    }
    moveToNextWordCorrect(req, res, activeQuestion);
    var html = await ejs.renderFile("views/partials/word.ejs", {
      word: word,
      correct: true,
    });
    res.send(html);
  } else {
    // get word from database
    let word = db
      .prepare(wordModel.getWordById)
      .get({ wordId: answer });
      
      let type = db
      .prepare(activeQuestionModel.getActiveQuestion)
      .get({ userId: req.session.user_id });
      if(type.type == 1){
        // swap foreign and native word and both descriptions
      
        let temp = word.foreignWord;
        word.foreignWord = word.nativeWord;
        word.nativeWord = temp;
        temp = word.foreignDescription;
        word.foreignDescription = word.nativeDescription;
        word.nativeDescription = temp;
      }
      
    moveToNextQuestion(req, res, activeQuestion);
    // check type of active question
    var html = await ejs.renderFile("views/partials/word.ejs", {
      word: word,
      correct: false,
    });
    res.send(html);
  }
}

async function checkAnswerWriting(req, res) {
  var activeQuestion = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  var answer = req.body.foreignWord;
  var word = db
    .prepare(wordModel.getWordById)
    .get({ wordId: activeQuestion.word_id });
  //console.log(word)
  // convert both to lowercase and compare
  if (answer.toLowerCase() == word.foreignWord.toLowerCase()) {
    moveToNextWordCorrect(req, res, activeQuestion);
    let html = await ejs.renderFile("views/partials/writeWordAnswer.ejs", {
      word: word,
      correct: true,
    });
    res.send(html)
  } else {
    moveToNextQuestion(req, res, activeQuestion);
    let html = await ejs.renderFile("views/partials/writeWordAnswer.ejs", {
      word: word,
      correct: false,
    });
    res.send(html);
  }
}

async function checkAnswerListening(req, res) {
  let activeQuestion = db
    .prepare(activeQuestionModel.getActiveQuestion)
    .get({ userId: req.session.user_id });
  // random a number between 0 and 100
  let random = Math.floor(Math.random() * 100);
  if (random > 50) {
    moveToNextWordCorrect(req, res, activeQuestion);
    let html = await ejs.renderFile("views/partials/sayWordAnswer.ejs", {
        answerPercentage: random,
    });
    res.send(html);
  } else {
    moveToNextQuestion(req, res, activeQuestion);
    let html = await ejs.renderFile("views/partials/sayWordAnswer.ejs", {
        answerPercentage: random,
    });
    res.send(html);
  }
}

async function editWord(req, res) {
  // check if method is post or get
  if (req.method == "POST") {
    // get id from url
    let id = req.body.id;
    // get word from database
    let word = db.prepare(wordModel.getWordById).get({ wordId: id });
    // get data from form
    let foreignWord = req.body.foreignWord;
    let foreignDescription = req.body.foreignDescription;
    let nativeWord = req.body.nativeWord;
    let nativeDescription = req.body.nativeDescription;
    let newPronunciation = req.body.pronunciation;
    if (word.pronunciation == undefined) {
      word.pronunciation = "null";
    }

    if (
      newPronunciation != word.pronunciation &&
      word.pronunciation != "null"
    ) {
      //fs.unlinkSync("./public/pronunciation/" + word.pronunciation);
    }
    // update word in database
    let updateWord = db.prepare(wordModel.updateWord).run({
      wordId: id,
      foreignWord: foreignWord,
      foreignDescription: foreignDescription,
      nativeWord: nativeWord,
      nativeDescription: nativeDescription,
      pronunciation: newPronunciation,
    });
    if (updateWord.changes == 0) {
      res.render("forOFor", {
        status: 404,
        errorText: "Greska kod spremanja riječi",
        link: "/dashboard",
      });
    }
    res.redirect("/dictionary/dictSearch/" + word.dictionary_id);
  } else {
    let id = req.params.id;
    // get word from database
    let word = db.prepare(wordModel.getWordById).get({ wordId: id });
    // get dictionary from database
    let dictionary = db
      .prepare(dictionaryModel.getDictionaryById)
      .get({ id: word.dictionary_id });
    res.render("editWord", {
      title: "Edit Word",
      word: word,
      dictionary: dictionary,
    });
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
    if (pronunciationFileName == "" || pronunciationFileName == undefined || pronunciationFileName == null) {
        pronunciationFileName =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8) +
        ".mp3";
      let pronunciationFilePath =
        "./public/pronunciation/" + pronunciationFileName;

      await createPronunciationFunc(foreignWord, pronunciationFilePath);
    }
    // check if any field is empty
    if (
      foreignWord == "" ||
      foreignDescription == "" ||
      nativeWord == "" ||
      nativeDescription == "" 
    ){
      res.render("forOFor", {
        status: 404,
        errorText: "Greska kod stvaranja riječi",
        link: "javascript:history.back()",
      });

    }

    
    let word = db.prepare(wordModel.createWord).run({
      foreignWord: foreignWord,
      foreignDescription: foreignDescription,
      nativeWord: nativeWord,
      nativeDescription: nativeDescription,
      pronunciation: pronunciationFileName,
      dictionaryId: dictionaryId,
    });
    if (word.changes == 0) {
      res.render("forOFor", {
        status: 404,
        errorText: "Greska kod stvaranja riječi",
        link: "/dashboard",
      });
    }
    res.redirect("/dictionary/dictSearch/" + dictionaryId);
  } else {
    let id = req.params.id;
    // get dictionary from database
    let dictionary = db
      .prepare(dictionaryModel.getDictionaryById)
      .get({ id: id });
    res.render("addWord", {
      title: "Add Word",
      dictionary: dictionary,
      word: {
        nativeWord: "",
        nativeDescription: "",
        foreignWord: "",
        foreignDescription: "",
        pronunciation: "",
      },
    });
  }
}

async function createPronunciation(req, res) {
  let word = req.body;
  let dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: req.params.id });
  let pronunciationFileName =
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8) +
    ".mp3";
  let pronunciationFilePath = "./public/pronunciation/" + pronunciationFileName;

  await createPronunciationFunc(word.foreignWord, pronunciationFilePath);
  word.pronunciation = pronunciationFileName;
  // generate html
  var html = await ejs.renderFile("views/partials/wordsEdit.ejs", {
    word: word,
    dictionary: dictionary,
  });
  res.status(200).send(html);
}

async function fillSentenceData(req, res) {
  // get nativeDescription from body
  let nativeDescription = req.body.nativeDescription;
  // get dictionary id from url
  let id = req.params.id;
  // get dictionary from database
  let dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: id });
  // get word from database
  let word = db.prepare(wordModel.getWordById).get({ wordId: req.body.id });
  let dictionaryLanguage = db
    .prepare(LanguageModel.getLanguageById)
    .get({ id: dictionary.language_id });
  if (word == undefined) {
    word = {
      nativeWord: "",
      nativeDescription: "",
      foreignWord: "",
      foreignDescription: "",
      pronunciation: "",
    };
  }
  word.pronunciation = req.body.pronunciation;
  word.nativeWord = req.body.nativeWord;
  word.foreignWord = req.body.foreignWord;
  if (
    nativeDescription == "" ||
    nativeDescription == undefined ||
    nativeDescription == null
  ) {
    res.status(404).json({ text: "Error word empty" });
    return;
  }
  if (nativeDescription != word.nativeDescription) {
    word.nativeDescription = nativeDescription;
    try {
      word.foreignDescription = await translate(word.nativeDescription, {
        to: dictionaryLanguage.shorthand,
      });
      word.foreignDescription = word.foreignDescription[0];
    } catch (error) {
      res.status(404).json({ text: "Error translation error" });
      return;
    }
  }
  // generate html
  var html = await ejs.renderFile("views/partials/wordsEdit.ejs", {
    word: word,
    dictionary: dictionary,
  });
  res.status(200).send(html);
}


async function fillWordData(req, res) {
  // get word from body
  let inword = req.body.nativeWord;
  if (inword == "" || inword == undefined || inword == null) {
    res.status(404).json({ text: "Error word empty" });
    return;
  }
  // get dictionary id from url
  let id = req.params.id;
  // get dictionary from database
  let dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: id });
  let word = db.prepare(wordModel.getWordById).get({ wordId: req.body.id });
  let dictionaryLanguage = db
    .prepare(LanguageModel.getLanguageById)
    .get({ id: dictionary.language_id });
  if (word == undefined) {
    word = {
      nativeWord: "",
      nativeDescription: "",
      foreignWord: "",
      foreignDescription: "",
      pronunciation: "",
    };
  }
  if (inword == "" || inword == undefined || inword == null) {
    res.status(404).json({ text: "Error word empty" });
    return;
  }

  let languageCode = dictionary.language;
  let extendedresult = "";
  let nativeDescription = req.body.nativeDescription;
  let example = "";
  if (inword != word.nativeWord) {
    word.nativeWord = inword;
    // get language code
    try {
      word.foreignWord = await translate(inword, { to: "en" });
      word.foreignWord = word.foreignWord[0];
    } catch (error) {
      res.status(404).json({ text: "Error translation error" + error });
      return;
    }
    try {
      extendedresult = await axios.get(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.foreignWord
      );
      // check if error
    } catch (error) {
      res.status(404).json({ text: "Error word not found" });
      return;
    }

    for (var i = 0; i < extendedresult.data.length; i++) {
      for (var j = 0; j < extendedresult.data[i].meanings.length; j++) {
        if (
          extendedresult.data[i].meanings[j].definitions[0].example != undefined
        ) {
          example = extendedresult.data[i].meanings[j].definitions[0].example;
          i = extendedresult.data.length;
          break;
        }
      }
    }

    word.foreignDescription = example;
    try {
      word.nativeDescription = await translate(word.foreignDescription, {
        to: "hr",
      });
      word.nativeDescription = word.nativeDescription[0];
    } catch (error) {
      res.status(404).json({ text: "Error translation error" });
      return;
    }
    if (dictionaryLanguage.shorthand != "en") {
      try {
        word.foreignWord = await translate(word.foreignWord, {
          to: dictionaryLanguage.shorthand,
        });
        word.foreignWord = word.foreignWord[0];
        word.foreignDescription = await translate(word.foreignDescription, {
          to: dictionaryLanguage.shorthand,
        });
        word.foreignDescription = word.foreignDescription[0];
      } catch (error) {
        res.status(404).json({ text: "Error translation error" });
        return;
      }
    }
  }

  let pronunciation = req.body.pronunciation;

  if (
    (pronunciation == "null" ||
    pronunciation == "" ||
    pronunciation == undefined)
  ) {
    let pronunciationFileName =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8) +
      ".mp3";
    let pronunciationFilePath =
      "./public/pronunciation/" + pronunciationFileName;

    await createPronunciationFunc(word.foreignWord, pronunciationFilePath);
    word.pronunciation = pronunciationFileName;
  }

  // generate html
  var html = await ejs.renderFile("views/partials/wordsEdit.ejs", {
    word: word,
    dictionary: dictionary,
  });
  res.status(200).send(html);
}

function deleteWord(req, res) {
  // get id from url
  let id = req.params.id;
  // get id of dictionary
  let wordDictionaryId = db.prepare(wordModel.getWordById).get({ wordId: id });
  // delete word from active question for all users
  let activeQuestion = db
    .prepare(activeQuestionModel.deleteActiveQuestionWordId)
    .run({ wordId: id });
    //console.log(activeQuestion)
  let userword = db.prepare(userWordModel.deleteUserWordbyId).run({ wordId: id });
  let word = db.prepare(wordModel.deleteWordById).run({ wordId: id });
  res.redirect("/dictionary/dictSearch/" + wordDictionaryId.dictionary_id);
}

async function searchWords(req, res) {
  const id = req.params.id;
  const word = req.body.word;
  const allwords = db
    .prepare(wordModel.searchWordByDictionaryId)
    .all({ dictionaryId: id, word: word });
  const Dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: id });
  var html = await ejs.renderFile("views/partials/wordsList.ejs", {
    words: allwords,
  });
  res.status(200).send(html);
}

module.exports = {
  learnSession,
  checkAnswer,
  editWord,
  deleteWord,
  addWord,
  fillWordData,
  searchWords,
  fillSentenceData,
  createPronunciation,
  checkAnswerWriting,
  checkAnswerListening,
};
