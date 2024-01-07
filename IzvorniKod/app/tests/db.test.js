const user = require('../models/user_model');
const language = require('../models/language_model');
const db = require('../database/database');

describe("Correct email select test", () => {
    test("It should find user Nino", () => {
        var foundUser = db.prepare(user.getUserByEmail).get({ email: "***REMOVED***" });
        expect(foundUser.email).toBe("***REMOVED***");
    });
});

describe("Non existant email select test", () => {
    test("It should not find any user", () => {
        var foundUser = db.prepare(user.getUserByEmail).get({ email: "blabla@gmail.com"});
        expect(foundUser).toBe(undefined);
    });
});

describe("Get all users test", () => {
    test("It should return all test case users", () => {
        var users = db.prepare(user.getAllUsers).all();
        expect(users.length).toBe(2);
    });
});

describe("Get user by id test", () => {
    test("It should return user with id 2 (nino)", () => {
        var foundUser = db.prepare(user.getUserById).get({ id: 2 });
        expect(foundUser.email).toBe("***REMOVED***");
    });
});

describe("Get all languages test", () => {
    test("It should return all languages", () => {
        var languages = db.prepare(language.getAllLanguages).all();
        expect(languages.length).toBe(7);
    });
});

describe("Get language by id test", () => {
    test("It should return language with id 1 (english)", () => {
        var foundLanguage = db.prepare(language.getLanguageById).get({ id: 1 });
        expect(foundLanguage.name).toBe("Engleski");
    });
});