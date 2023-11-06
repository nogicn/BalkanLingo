const createUserTable = `
    CREATE TABLE user
    (
        id INTEGER NOT NULL,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        token TEXT,
        PRIMARY KEY (id),
        UNIQUE (email)
    );
    `;

const createUser = `INSERT INTO user (name, surname, email, password) VALUES (?, ?, ?, ?)`;
const createUserWithRole = `INSERT INTO user (name, surname, email, password, is_admin) VALUES (?, ?, ?, ?, ?)`;

const loginEmailPassword = `SELECT * FROM user WHERE email = ? AND password = ?`;

const getAllUsers = `SELECT * FROM user`;

const getUserByToken = `SELECT * FROM user WHERE token = ?;`;
const updateTokenByEmail = `UPDATE user SET token = ? WHERE email = ? RETURNING *;`;

module.exports = {
    createUserTable,
    createUser,
    loginEmailPassword,
    getAllUsers,
    getUserByToken,
    updateTokenByEmail,
    createUserWithRole
};


