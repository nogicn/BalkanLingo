const userModel = require('../models/user_model');
const wordModel = require('../models/word_model');
const dictionaryModel = require('../models/dictionary_model');
const dictinoaryUserModel = require('../models/dictionary_user_model');
const activeQuestionModel = require('../models/active_question_model');
const db = require('./database');
const axios = require('axios');

function migration(){
    
    db.prepare(userModel.createUserTable).run();
    db.prepare(wordModel.createWordTable).run();
    db.prepare(dictionaryModel.createDictionaryTable).run();
    // timeout for creating dictionary_user table
    
    // create user
    db.prepare(userModel.createAdmin).run({name:"Admin", surname:"Admin", email:"admin@gmail.com", password:"123"});
    db.prepare(userModel.createUser).run({name:"User", surname:"User", email:"user@gmail.com", password:"123"});
    
    db.prepare(dictionaryModel.createNewDictionary).run({name:"Engleski", language:"EN", imageLink:"https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png", flagIconLink:"🇬🇧", description:"Engleski rjecnik"});
    db.prepare(wordModel.createWord).run({foreignWord:"Hello", foreignDescription:"Hello there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede", pronounciation:"null", dictionaryId:1});
    db.prepare(wordModel.createWord).run({foreignWord:"Goodbye", foreignDescription:"Goodbye neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronounciation:"null", dictionaryId:1});
    db.prepare(wordModel.createWord).run({foreignWord:"Please", foreignDescription:"Please help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronounciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"Thank you", foreignDescription:"Thank you for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronounciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"Yes", foreignDescription:"Yes I will help you", nativeWord: "Da", nativeDescription: "Da pomoci cu vam",pronounciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"No", foreignDescription:"No I will not help you", nativeWord: "Ne", nativeDescription: "Ne necu vam pomoci",pronounciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"I", foreignDescription:"I am a student", nativeWord: "Ja", nativeDescription: "Ja sam student",pronounciation:"null", dictionaryId: 1});
    db.prepare(wordModel.createWord).run({foreignWord:"You", foreignDescription:"You are a teacher", nativeWord: "Ti", nativeDescription: "Ti si profesor",pronounciation:"null", dictionaryId: 1});

    db.prepare(dictionaryModel.createNewDictionary).run({name:"Njemacki", language:"DE", imageLink:"https://cdn.countryflags.com/thumbs/germany/flag-400.png", flagIconLink:"🇩🇪", description:"Njemacki rjecnik"});
    db.prepare(wordModel.createWord).run({foreignWord:"Hallo", foreignDescription:"Hallo there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede",pronounciation:"null", dictionaryId:2});
    db.prepare(wordModel.createWord).run({foreignWord:"Auf Wiedersehen", foreignDescription:"Auf Wiedersehen neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronounciation:"null", dictionaryId:2});
    db.prepare(wordModel.createWord).run({foreignWord:"Bitte", foreignDescription:"Bitte help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronounciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Danke", foreignDescription:"Danke for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronounciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Ja", foreignDescription:"Ja will help you", nativeWord: "Da", nativeDescription: "Da pomoci cu vam",pronounciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Nein", foreignDescription:"Nein I will not help you", nativeWord: "Ne", nativeDescription: "Ne necu vam pomoci",pronounciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Ich", foreignDescription:"Ich bin a student", nativeWord: "Ja", nativeDescription: "Ja sam student",pronounciation:"null", dictionaryId: 2});
    db.prepare(wordModel.createWord).run({foreignWord:"Du", foreignDescription:"Du bist a teacher", nativeWord: "Ti", nativeDescription: "Ti si profesor",pronounciation:"null", dictionaryId: 2});    

    db.prepare(dictionaryModel.createNewDictionary).run({name:"Francuski", language:"FR", imageLink:"https://cdn.countryflags.com/thumbs/france/flag-400.png", flagIconLink:"🇫🇷", description:"Francuski rjecnik"});
    db.prepare(wordModel.createWord).run({foreignWord:"Bonjour", foreignDescription:"Bonjour there neighbor", nativeWord:"Zdravo", nativeDescription:"Zdravo susjede",pronounciation:"null", dictionaryId:3});
    db.prepare(wordModel.createWord).run({foreignWord:"Au revoir", foreignDescription:"Au revoir neighbor", nativeWord:"Dovidjenja", nativeDescription:"Dovidjenja susjede",pronounciation:"null", dictionaryId:3});
    db.prepare(wordModel.createWord).run({foreignWord:"S'il vous plait", foreignDescription:"S'il vous plait help me", nativeWord: "Molim", nativeDescription: "Molim vas pomognite mi",pronounciation:"null", dictionaryId: 3});
    db.prepare(wordModel.createWord).run({foreignWord:"Merci", foreignDescription:"Merci for your help", nativeWord: "Hvala", nativeDescription: "Hvala vam na pomoci",pronounciation:"null", dictionaryId: 3});

    console.log(db.prepare(userModel.getAllUsers).all());
    console.log(db.prepare(dictionaryModel.getAllDictionaries).all());
    db.prepare(dictinoaryUserModel.createDictionaryUserTable).run();
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:1, dictionaryId:1});
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:1, dictionaryId:2});
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:2, dictionaryId:1});

    db.prepare(activeQuestionModel.createActiveQuestionTable).run();
    console.log("Migration complete")
}


module.exports = {
    migration,
}
