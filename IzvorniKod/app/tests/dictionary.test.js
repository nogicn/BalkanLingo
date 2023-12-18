const request = require("supertest");
const app = require("../app");

require("dotenv").config();

describe("Root path test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/")
        .expect(200);
    });
});

describe("Adding dictionary test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/addDictionary")
        .expect(302);
    });
});

describe("Adding dictionary to user test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/addDictionaryToUser/1")
        .expect(302);
    });
});

describe("Searching dictionary test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/dictSearch/1")
        .expect(302);
    });
});

describe("Removing dictionary test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/removeDictionary/1")
        .expect(302);
    });
});

describe("Next question test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/nextQuestion/1")
        .expect(302);
    });
});

describe("Checking answer test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/checkWord/1")
        .expect(302);
    });
});

describe("Adding word to dictionary test (GET)", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/addWord/1")
        .expect(302);
    });
});

describe("Adding word to dictionary test (POST)", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/addWord/1")
        .expect(302);
    });
});

describe("Filling word data test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/fillWordData/1")
        .expect(302);
    });
});

describe("Filling sentence data test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/fillSentenceData/1")
        .expect(302);
    });
});

describe("Creating pronunciation test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/createPronunciation/1")
        .expect(302);
    });
});

describe("Editing word test (GET)", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/editWord/1")
        .expect(302);
    });
});

describe("Editing word test (POST)", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/editWord/1")
        .expect(302);
    });
});

describe("Deleting word test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/deleteWord/1")
        .expect(302);
    });
});

describe("Searching words test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .post("/dictionary/search/1")
        .expect(302);
    });
});

describe("Admin adding dictionary test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/dictionary/adminAddDict")
        .expect(302);
    });
});
