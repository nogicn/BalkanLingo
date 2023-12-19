const userModel = require('../models/user_model');
const wordModel = require('../models/word_model');
const dictionaryModel = require('../models/dictionary_model');
const dictinoaryUserModel = require('../models/dictionary_user_model');
const activeQuestionModel = require('../models/active_question_model');
const languageModel = require('../models/language_model');
const db = require('./database');
const axios = require('axios');
const userWordModel = require('../models/user_word_model');

function migration(){
    
    db.prepare(userModel.createUserTable).run();
    db.prepare(wordModel.createWordTable).run();
    db.prepare(dictionaryModel.createDictionaryTable).run();
    db.prepare(languageModel.createLanguageTable).run();
    // timeout for creating dictionary_user table
    
    // create user
    db.prepare(userModel.createAdmin).run({name:"Admin", surname:"Admin", email:"***REMOVED***", password:"123"});
    db.prepare(userModel.createUser).run({name:"User", surname:"User", email:"***REMOVED***", password:"123"});

    // create languages
    db.prepare(languageModel.createNewLanguage).run({name:"Engleski", shorthand:"en", flagIcon:"🇬🇧"}); // id = 1
    db.prepare(languageModel.createNewLanguage).run({name:"Njemacki", shorthand:"de", flagIcon:"🇩🇪"}); // id = 2
    db.prepare(languageModel.createNewLanguage).run({name:"Francuski", shorthand:"fr", flagIcon:"🇫🇷"}); // id = 3
    

    db.prepare(dictionaryModel.createNewDictionary).run({name:"Engleski", language_id:"1", imageLink:"https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png"});
    db.prepare(wordModel.createWord).run({foreignWord:"Hello", foreignDescription:"Hello there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede", pronunciation:"null", dictionaryId:1});
    db.prepare(wordModel.createWord).run({foreignWord:"Goodbye", foreignDescription:"Goodbye neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronunciation:"null", dictionaryId:1});
    db.prepare(wordModel.createWord).run({foreignWord:"Please", foreignDescription:"Please help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronunciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"Thank you", foreignDescription:"Thank you for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronunciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"Yes", foreignDescription:"Yes I will help you", nativeWord: "Da", nativeDescription: "Da pomoci cu vam",pronunciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"No", foreignDescription:"No I will not help you", nativeWord: "Ne", nativeDescription: "Ne necu vam pomoci",pronunciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"I", foreignDescription:"I am a student", nativeWord: "Ja", nativeDescription: "Ja sam student",pronunciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"You", foreignDescription:"You are a teacher", nativeWord: "Ti", nativeDescription: "Ti si profesor",pronunciation:"null", dictionaryId: 1});

    db.prepare(dictionaryModel.createNewDictionary).run({ name: "Njemacki", language_id: "2", imageLink: "https://cdn.countryflags.com/thumbs/germany/flag-400.png" });
    db.prepare(wordModel.createWord).run({foreignWord:"Hallo", foreignDescription:"Hallo there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede",pronunciation:"null", dictionaryId:2});
    db.prepare(wordModel.createWord).run({foreignWord:"Auf Wiedersehen", foreignDescription:"Auf Wiedersehen neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronunciation:"null", dictionaryId:2});
    db.prepare(wordModel.createWord).run({foreignWord:"Bitte", foreignDescription:"Bitte help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronunciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Danke", foreignDescription:"Danke for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronunciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Ja", foreignDescription:"Ja will help you", nativeWord: "Da", nativeDescription: "Da pomoci cu vam",pronunciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Nein", foreignDescription:"Nein I will not help you", nativeWord: "Ne", nativeDescription: "Ne necu vam pomoci",pronunciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Ich", foreignDescription:"Ich bin a student", nativeWord: "Ja", nativeDescription: "Ja sam student",pronunciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Du", foreignDescription:"Du bist a teacher", nativeWord: "Ti", nativeDescription: "Ti si profesor",pronunciation:"null", dictionaryId: 2});    

    db.prepare(dictionaryModel.createNewDictionary).run({name:"Francuski", language_id:"3", imageLink:"https://cdn.countryflags.com/thumbs/france/flag-400.png"});
    db.prepare(wordModel.createWord).run({foreignWord:"Bonjour", foreignDescription:"Bonjour there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede",pronunciation:"null", dictionaryId:3});
    db.prepare(wordModel.createWord).run({foreignWord:"Au revoir", foreignDescription:"Au revoir neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronunciation:"null", dictionaryId:3});
    db.prepare(wordModel.createWord).run({foreignWord:"S'il vous plait", foreignDescription:"S'il vous plait help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronunciation:"null", dictionaryId: 3});
    db.prepare(wordModel.createWord).run({foreignWord:"Merci", foreignDescription:"Merci for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronunciation:"null", dictionaryId: 3});

    console.log(db.prepare(userModel.getAllUsers).all());
    console.log(db.prepare(dictionaryModel.getAllDictionaries).all());
    db.prepare(dictinoaryUserModel.createDictionaryUserTable).run();
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:1, dictionaryId:1});
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:1, dictionaryId:2});
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:2, dictionaryId:1});

    db.prepare(activeQuestionModel.createActiveQuestionTable).run();

    db.prepare(userWordModel.createUserWordTable).run();
    console.log("Migration complete")
}


module.exports = {
    migration,
}
