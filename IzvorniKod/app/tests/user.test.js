const request = require("supertest");
const app = require("../app");

require("dotenv").config();

describe("Root path test", () => {
    test("It should respond with not found (404)", () => {
        return request(app)
        .get("/user")
        .expect(404);
    });
});

describe("Logout test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/user/logout")
        .expect(302);
    });
});

describe("Edit user test", () => {
    test("It should redirect to login page (302)", () => {
        return request(app)
        .get("/user/edit")
        .expect(302);
    });
});