const db = require('../database/database');
const dictionaryModel = require('../models/dictionary_model');
const userModel = require('../models/user_model');

function addDict(req, res) {
    // get all dictionaries from database
    //const dict = db.prepare("SELECT * FROM dictionary").all();
    res.redirect('/addDictionary');
}

function dashboard (req, res) {
    let user = db.prepare(userModel.getUserByToken).get({token:req.session.token});
    console.log(user);
    let dictionaries = [];
    if (req.session.is_admin) {
        dictionaries = db.prepare(dictionaryModel.getAllDictionaries).all();
    }else {
        dictionaries = db.prepare(dictionaryModel.getDictionariesForUser).all({userId:user.id});
    }
    res.render('landingPage', { title: 'Express', dictionaries: dictionaries, is_admin: req.session.is_admin });
}
module.exports = {
    addDict,
    dashboard
}