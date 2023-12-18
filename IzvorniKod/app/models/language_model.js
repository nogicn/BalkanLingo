const createLanguageTable = `
    CREATE TABLE language (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        shorthand TEXT NOT NULL UNIQUE,
        flag_icon TEXT NOT NULL
    );
`;

const createNewLanguage = `
    INSERT INTO language (name, shorthand, flag_icon) VALUES (@name, @shorthand, @flagIcon);
`;

const getAllLanguages = `
    SELECT *
    FROM language;
`;

const getShorthands = `
    SELECT shorthand
    FROM language;
`;

module.exports = {
    createLanguageTable,
    createNewLanguage,
    getAllLanguages,
    getShorthands
}
