const createActiveQuestionTable = `
    CREATE TABLE active_question (
        user_id INTEGER PRIMARY KEY,
        word_id INTEGER NOT NULL,
        type INTEGER NOT NULL DEFAULT 1, -- (1, 2, 3)
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (word_id) REFERENCES word(id)
    );
`;

const setActiveQuestion = `
    DELETE FROM active_question WHERE user_id = @userId;
    INSERT INTO active_question (user_id, word_id, type) VALUES (@userId, @wordId, @type);
`;

module.exports = {
    createActiveQuestionTable,
    setActiveQuestion
}