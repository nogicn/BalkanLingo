const request = require("supertest");
const path = require('path')
//overrode the .env file for testing purposes
require("dotenv").config(
    {
        path: path.resolve(__dirname, "../.env.test.admin")
    }
);
const app = require("../app");

describe("Dictionary root path test", () => {
    test("It should respond with not found (404)", () => {
        return request(app)
        .get("/dictionary")
        .expect(404);
    });
});

describe("Adding dictionary test", () => {
    test("It should redirect to /adminAddDict (302)", () => {
        return request(app)
        .get("/dictionary/addDictionary")
        .expect(302);
    });
});

describe("Searching dictionary test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/dictionary/dictSearch/1")
        .expect(200);
    });
});

describe("Adding word to dictionary test (GET)", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/dictionary/addWord/1")
        .expect(200);
    });
});

describe("Editing word test (GET)", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/dictionary/editWord/2")
        .expect(200);
    });
});

describe("Admin adding dictionary test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/dictionary/adminAddDict")
        .expect(200);
    });
});

