const request = require("supertest");
const path = require('path')
//overrode the .env file for testing purposes
require("dotenv").config(
    {
        path: path.resolve(__dirname, "../.env.test.guest")
    }
);
const app = require("../app");

describe("Root path test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/")
        .expect(200);
    });
});

describe("Login test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/login")
        .expect(200);
    });
});

describe("Register test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/register")
        .expect(200);
    });
});

describe("Reset password test", () => {
    test("It should respond with OK (200)", () => {
        return request(app)
        .get("/reset")
        .expect(200);
    });
});

describe("User root path test", () => {
    test("It should respond with not found (404)", () => {
        return request(app)
        .get("/user")
        .expect(404);
    });
});

// Actions that require authentication

describe("Logout test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
        .get("/user/logout")
        .expect(403);
    });
});

describe("Edit user test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
        .get("/user/edit")
        .expect(403);
    });
});

describe("Adding dictionary test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
            .get("/dictionary/addDictionary")
            .expect(403);
    });
});

describe("Removing dictionary test", () => {
    test("It should respond with forbidden (403)", () => {
        return request(app)
            .get("/dictionary/removeDictionary/2")
            .expect(403);
    });
});