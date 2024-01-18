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

const getLanguageById = `
    SELECT *
    FROM language
    WHERE id = @id;
`;

const deleteLanguageById = `
    DELETE FROM language
    WHERE id = @id;
`;

const updateLanguage = `
    UPDATE language
    SET name = @name,
        shorthand = @shorthand,
        flag_icon = @flagIcon
    WHERE id = @id;
`;

module.exports = {
    createLanguageTable,
    createNewLanguage,
    getAllLanguages,
    getShorthands,
    getLanguageById,
    deleteLanguageById,
    updateLanguage,
}
