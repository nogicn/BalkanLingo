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
    db.prepare(activeQuestionModel.createActiveQuestionTable).run();
    db.prepare(userWordModel.createUserWordTable).run();
    db.prepare(dictinoaryUserModel.createDictionaryUserTable).run();


    // timeout for creating dictionary_user table
    
    
    // create languages
    db.prepare(languageModel.createNewLanguage).run({name:"Engleski", shorthand:"en", flagIcon:"🇬🇧"}); // id = 1
    db.prepare(languageModel.createNewLanguage).run({name:"Njemacki", shorthand:"de", flagIcon:"🇩🇪"}); // id = 2
    db.prepare(languageModel.createNewLanguage).run({name:"Francuski", shorthand:"fr", flagIcon:"🇫🇷"}); // id = 3
    db.prepare(languageModel.createNewLanguage).run({name:"Španjolski", shorthand:"sp", flagIcon:"🇪🇸"}); // id = 4
    db.prepare(languageModel.createNewLanguage).run({name:"Talijanski", shorthand:"it", flagIcon:"🇮🇹"}); // id = 5
    db.prepare(languageModel.createNewLanguage).run({name:"Ruski", shorthand:"ru", flagIcon:"🇷🇺"}); // id = 6
    db.prepare(languageModel.createNewLanguage).run({name:"Kineski", shorthand:"ch", flagIcon:"🇨🇳"}); // id = 7
    db.prepare(languageModel.createNewLanguage).run({name:"Japanski", shorthand:"jp", flagIcon:"🇯🇵"}); // id = 8
    
    // create dictionaries
    db.prepare(dictionaryModel.createNewDictionary).run({name:"Engleski-Hrana", language_id:"1", imageLink:"https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png"});
    db.prepare(dictionaryModel.createNewDictionary).run({ name: "Njemacki-Hrana", language_id: "2", imageLink: "https://cdn.countryflags.com/thumbs/germany/flag-400.png" });

    // create user
    db.prepare(userModel.createAdmin).run({name:"Admin", surname:"Admin", email:"***REMOVED***", password:"123"});
    db.prepare(userModel.createUser).run({name:"User", surname:"User", email:"***REMOVED***", password:"123"});
    db.prepare(dictinoaryUserModel.addDictionaryToUser).run({userId:2, dictionaryId:1});
    
    

} 


module.exports = {
    migration,
}
