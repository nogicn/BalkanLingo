const users = require('../models/users_model');
const db = require('./database');

const createUser = `INSERT INTO user (name, surname, email, password, admin) VALUES (?, ?, ?, ?, ?)`;

const loginEmailPassword = `SELECT * FROM user WHERE email = ? AND password = ?`;

const getAllUsers = `SELECT * FROM user`;

// export all functions
module.exports = {
    createUser,
    loginEmailPassword,
    getAllUsers
}