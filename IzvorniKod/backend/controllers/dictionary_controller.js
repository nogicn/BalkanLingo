const db = require('../database/database');
const dictionaryModel = require('../models/dictionary_model');
const dictionaryUserModel = require('../models/dictionary_user_model');
const userModel = require('../models/user_model');
const wordModel = require('../models/word_model');
const dictinoaryUserModel = require('../models/dictionary_user_model');

function getAllDictionaries(req, res) {
    const dictionaries = db.prepare("SELECT * FROM dictionary").all();
    res.render('addDictionary', { title: 'Add Dictionary', dictionaries: dictionaries });
}

function searchDictionary(req, res) {
    const id = req.params.id;
    const allwords = db.prepare(wordModel.getWordByDictionaryId).all({dictionaryId:id});
    //const result = db.prepare(dictionaryUserModel.addDictionaryToUser).run({dictionaryId:id, userId:req.session.userId});
    res.render('dictSearch', { title: 'Search Dictionary', words: allwords });
}

function removeDictionary(req, res) {
    if (req.session.is_admin) {

        try {
            const id = req.params.id;
            const allwords = db.prepare(wordModel.deleteWordByDictionaryId).run({dictionaryId:id});
            const allusers = db.prepare(userModel.getAllUsers).all();
            for (let i = 0; i < allusers.length; i++) {
                const result = db.prepare(dictionaryUserModel.deleteDictionaryFromUser).run({dictionaryId:id, userId:allusers[i].id});
            }
            const deleteDictionary = db.prepare(dictionaryModel.deleteDictionary).run({id:id});
            res.redirect('/dashboard');
        }catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error: " + err.message);
            return;
        }
        
    }
    else {
       try {
        const id = req.params.id;
        const user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
        db.prepare(dictionaryUserModel.deleteDictionaryFromUser).run({dictionaryId:id, userId:user.id});
        res.redirect('/dashboard');
       }catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error: " + err.message);
        return;
       }
    }
}

function addDict(req, res) {
    // get user from db
    const user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    // get all dictionaries not assigned to user
    const dictionaries = db.prepare(dictionaryModel.getDictionariesNotAssignedToUser).all({userId:user.id});

    res.render('addDictionary', { title: 'Add Dictionary', dictionaries: dictionaries });
}

module.exports = {
    getAllDictionaries,
    searchDictionary,
    removeDictionary,
    addDict
}