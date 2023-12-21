const db = require("../database/database");
const dictionaryModel = require("../models/dictionary_model");
const dictionaryUserModel = require("../models/dictionary_user_model");
const userModel = require("../models/user_model");
const wordModel = require("../models/word_model");
const dictinoaryUserModel = require("../models/dictionary_user_model");
const activeQuestionModel = require("../models/active_question_model");
const languageModel = require("../models/language_model");
const ejs = require("ejs");

function dashboard(req, res) {
  let dictionaries = [];
  if (req.session.is_admin) {
    dictionaries = db
      .prepare(dictionaryModel.getAllDictionariesWithIcons)
      .all();
  } else {
    dictionaries = db
      .prepare(dictionaryModel.getDictionariesForUser)
      .all({ userId: req.session.user_id });
  }
  console.log(dictionaries);
  res.render("landingPage", {
    title: "Express",
    dictionaries: dictionaries,
    is_admin: req.session.is_admin,
  });
}

function getAllDictionaries(req, res) {
  let dictionaries = [];
  if (req.session.is_admin) {
    res.redirect("/dashboard");
  } else {
    dictionaries = db
      .prepare(dictionaryModel.getDictionariesNotAssignedToUser)
      .all({ userId: req.session.user_id });
  }

  res.render("addDictionary", {
    title: "Add Dictionary",
    dictionaries: dictionaries,
  });
}

function searchDictionary(req, res) {
  const id = req.params.id;
  const allwords = db
    .prepare(wordModel.getWordByDictionaryId)
    .all({ dictionaryId: id });
  const Dictionary = db
    .prepare(dictionaryModel.getDictionaryById)
    .get({ id: id });
  res.render("dictSearch", {
    title: "Search Dictionary",
    words: allwords,
    dictionary: Dictionary,
  });
}

function removeDictionary(req, res) {
  if (req.session.is_admin) {
    try {
      const id = req.params.id;
      const getAllWordsFromDictionary = db
        .prepare(wordModel.getWordByDictionaryId)
        .all({ dictionaryId: id });
      for (let i = 0; i < getAllWordsFromDictionary.length; i++) {
        const deleteWord = db
          .prepare(activeQuestionModel.deleteActiveQuestionWordId)
          .run({ wordId: getAllWordsFromDictionary[i].id });
      }

      const allwords = db
        .prepare(wordModel.deleteWordByDictionaryId)
        .run({ dictionaryId: id });
      const allusers = db.prepare(userModel.getAllUsers).all();
      for (let i = 0; i < allusers.length; i++) {
        const result = db
          .prepare(dictionaryUserModel.deleteDictionaryFromUser)
          .run({ dictionaryId: id, userId: allusers[i].id });
      }
      const deleteDictionary = db
        .prepare(dictionaryModel.deleteDictionary)
        .run({ id: id });
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error: " + err.message);
      return;
    }
  } else {
    try {
      const id = req.params.id;
      const user = db
        .prepare(userModel.getUserByToken)
        .get({ token: req.session.token });
      db.prepare(dictionaryUserModel.deleteDictionaryFromUser).run({
        dictionaryId: id,
        userId: user.id,
      });
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error: " + err.message);
      return;
    }
  }
}

function addDictionary(req, res) {
  if (req.session.is_admin) {
    res.redirect("/dictionary/adminAddDict");
  } else {
    // get user from db
    const user = db
      .prepare(userModel.getUserByToken)
      .get({ token: req.session.token });
    // get all dictionaries not assigned to user
    const dictionaries = db
      .prepare(dictionaryModel.getDictionariesNotAssignedToUser)
      .all({ userId: user.id });

    res.render("addDictionary", {
      title: "Add Dictionary",
      dictionaries: dictionaries,
    });
  }
}

function addDictionaryToUser(req, res) {
  const id = req.params.id;

  const result = db
    .prepare(dictionaryUserModel.addDictionaryToUser)
    .run({ dictionaryId: id, userId: req.session.user_id });
  res.redirect("/dashboard");
}

function adminAddDict(req, res) {
  let languages = db.prepare(languageModel.getAllLanguages).all();
  if (req.params.id === undefined) {
    res.render("dictionaryAddAdmin", {
      title: "Add Dictionary",
      dictionary: { id: undefined, name: "", language_id: 1, image_link: "" },
      languages: languages,
    });
  }
  try {
    const dictionary = db
      .prepare(dictionaryModel.getDictionaryById)
      .get({ id: req.params.id });

    res.render("dictionaryAddAdmin", {
      title: "Edit Dictionary",
      dictionary: dictionary,
      languages: languages,
    });
  } catch (error) {
    res.send(error);
    return;
  }
}

function adminSaveDict(req, res) {
  try {
    //hoce li ID biti ime rjecnika ili posebno da moze duplikat ime imati? za check prije updatea.
    const dictionary = db
      .prepare(dictionaryModel.getDictionaryById)
      .get({ id: req.body.id });
    if (dictionary === undefined) {
      let res = db
        .prepare(dictionaryModel.createNewDictionary)
        .run({
          name: req.body.description,
          language_id: req.body.language_id,
          imageLink: req.body.image_link,
        });
    } else {
      let res = db
        .prepare(dictionaryModel.updateDictionary)
        .run({
          name: req.body.description,
          language_id: req.body.language_id,
          imageLink: req.body.image_link,
          id: req.body.id,
        });
    }
  } catch (error) {
    res.send(error + " ");
    return;
  }
  res.redirect("/dashboard");
}

module.exports = {
  getAllDictionaries,
  searchDictionary,
  removeDictionary,
  addDict: addDictionary,
  addDictToUser: addDictionaryToUser,
  adminAddDict,
  adminSaveDict,
  dashboard,
};
