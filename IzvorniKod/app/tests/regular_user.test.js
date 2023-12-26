const request = require("supertest");
const app = require("../app");

require("dotenv").config();

// Actions that require regular user authentication

describe("Adding dictionary test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
            .get("/dictionary/addDictionary")
            .expect(200);
    });
});

describe("Removing dictionary test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
            .get("/dictionary/removeDictionary/2")
            .expect(302);
    });
});

// Actions that require admin authentication

describe("Searching dictionary test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
            .get("/dictionary/dictSearch/1")
            .expect(403);
    });
});

describe("Adding word to dictionary test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
            .get("/dictionary/addWord/1")
            .expect(403);
    });
});

describe("Editing word test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
            .get("/dictionary/editWord/1")
            .expect(403);
    });
});