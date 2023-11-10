const createUserWordTable = `
    CREATE TABLE user_word (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        last_answered TEXT, -- ISO 8601 format
        delay INTEGER,
        active INTEGER NOT NULL,
        word_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (word_id) REFERENCES word(id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        INDEX user_id_index (user_id)
    );
`;

const createUserWord = `
    INSERT INTO user_word (last_answered, delay, active, word_id, user_id) VALUES (@lastAnswered, @delay, @active, @wordId, @userId);
`;

const getWordsForUserForDictionary = `
    SELECT user_word.*, word.*
    FROM user_word, word
    WHERE user_word.word_id = word.id
    AND user_word.user_id = @userId
    AND word.dictionary_id = @dictionaryId;
`;

const getViableWordsForUserForDictionary = `
    SELECT user_word.*, word.*
    FROM user_word, word
    WHERE user_word.word_id = word.id
    AND user_word.user_id = @userId
    AND word.dictionary_id = @dictionaryId
    AND active = 1
    AND strftime('%s', 'now') - strftime('%s', last_answered) > delay * 24 * 60 * 60;
`;

const setNewDelayForUser = `
    UPDATE user_word
    SET delay = @delay
    WHERE user_id = @userId
    AND word_id = @wordId;
`;

const deactivateWordForUser = `
    UPDATE user_word
    SET active = 0
    WHERE user_id = @userId
    AND word_id = @wordId;
`;

module.exports = {
    createUserWordTable,
    createUserWord,
    getWordsForUserForDictionary,
    getViableWordsForUserForDictionary,
    setNewDelayForUser,
    deactivateWordForUser
}