const createUserTable = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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

const getUserByEmail = `
    SELECT * from user WHERE email = @email;
`;

const updateTokenByEmail = `
    UPDATE user SET token = @token WHERE email = @email RETURNING *;
`;

const updateTokenById = `
    UPDATE user SET token = @token WHERE id = @id RETURNING *;
`;

const updatePasswordByEmail = `
    UPDATE user SET password = @password WHERE email = @email RETURNING *;
`;

const updateUserByToken = `
    UPDATE user SET name = @name, surname = @surname WHERE token = @token RETURNING *;
`;

const setAdminByEmail = `
    UPDATE user SET is_admin = not is_admin WHERE email = @email RETURNING *;
`;

const getUserLikeEmail = 'SELECT * FROM user WHERE email LIKE @email';

const getUserById = 'SELECT * FROM user WHERE id = @id';

module.exports = {
    createUserTable,
    createUser,
    createAdmin,
    loginEmailPassword,
    getAllUsers,
    getUserByToken,
    getUserByEmail,
    updateTokenByEmail,
    updateTokenById,
    updatePasswordByEmail,
    updateUserByToken,
    getUserLikeEmail,
    setAdminByEmail,
    getUserById
};