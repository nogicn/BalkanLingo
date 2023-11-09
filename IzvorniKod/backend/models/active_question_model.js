const createActiveQuestionTable = `
    CREATE TABLE active_question (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER ,
        word_id INTEGER,
        type INTEGER NOT NULL DEFAULT 1, -- (1, 2, 3)
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (word_id) REFERENCES word(id)
    );
`;

const deleteActiveQuestion = `
    DELETE FROM active_question WHERE user_id = @userId;
    
`;

const setActiveQuestion = `
    INSERT INTO active_question (user_id, word_id, type) VALUES (@userId, @wordId, @type);
`;

const getActiveQuestion = `
    SELECT * FROM active_question WHERE user_id = @userId;
`;

module.exports = {
    createActiveQuestionTable,
    getActiveQuestion,
    setActiveQuestion,
    deleteActiveQuestion
}