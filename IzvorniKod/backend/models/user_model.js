const createUserTable = `
    CREATE TABLE user (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        token TEXT,
        UNIQUE (email)
    );
    `;

const createUser = `
    INSERT INTO user (name, surname, email, password) VALUES (@name, @surname, @email, @password);
`;

const createAdmin = `
    INSERT INTO user (name, surname, email, password, is_admin) VALUES (@name, @surname, @email, @password, 1);
`;

const loginEmailPassword = `
    SELECT * FROM user WHERE email = @email AND password = @password;
`;

const getAllUsers = `
    SELECT * FROM user;
`;

const getUserByToken = `
    SELECT * FROM user WHERE token = @token;
`;

const updateTokenByEmail = `
    UPDATE user SET token = @token WHERE email = @email RETURNING *;
`;
const updateTokenById = `
    UPDATE user SET token = @token WHERE id = @id RETURNING *;
`;

module.exports = {
    createUserTable,
    createUser,
    createAdmin,
    loginEmailPassword,
    getAllUsers,
    getUserByToken,
    updateTokenByEmail,
    updateTokenById
};


