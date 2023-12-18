const request = require("supertest");
const app = require("../app");

require("dotenv").config();

describe("Test the root path", () => {
    test("It should response the GET method", () => {
        return request(app)
        .get("/")
        .expect(200);
    });
    });

describe("Test adding words", () => {
    test("It should response the GET method", () => {
        return request(app)
        .get("/dictionary/addWord/1")
        .expect(302);
    });
    });