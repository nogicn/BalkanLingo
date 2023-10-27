# Balkan

This is a language learning application based on the spaced repetition technique. It facilitates learning new words through a series of spaced questions from a predefined word database. Students answer by selecting the correct translation from multiple alternatives. Correct answers advance the word to the next review container in the sequence, while incorrect answers send it back to the first container. Each container has a specific time duration after which the word is ready to be presented again as a question. The first container's expiration time is one day, the second container's two days, the third container's four or more days, and so on. Typically, there are five or six containers in the sequence, with the last one having an expiration time of several weeks to a month. Words that are answered correctly after the last container's expiration are considered learned and no longer participate in the review process.

## Contributors

- Nino Nogić
- Alberto Kerim
- Martin Bogoje
- Borna Krušlin
- Lana Marija Kuretić
- Petar Pandža
- Hrvoje Biloš

## Technologies Used

- Vue.js
- CSS
- JavaScript
- Node.js
- MySQL
- _______ API

## Getting Started

To get started with this application, follow these steps:

1. [Instructions for setup]

2. [Instructions for usage]

## Adding Words

The administrator can add new words of a given foreign language, with a focus on English for testing and demonstration purposes. Each word consists of an English word, several phrases describing the word, a translated word in Croatian, and additional descriptive phrases. The application also supports voice pronunciation files in English.

## Dictionaries

Words are organized into dictionaries, each with its own name and a list of associated words. Administrators can create new dictionaries and add words to them. Each new word can be assigned to one or more dictionaries that have been previously defined. The application provides suggestions to assist administrators when defining new words by querying an external dictionary.

## User Registration and Learning

Students can register using their email address and change their password. Upon registration, the initial password sent to their email must be changed upon first login. Students can select a dictionary to start learning from, continuing from their current learning state and a specific learning mode. Learning modes include:
- Querying English words with the selection of the Croatian translation.
- Querying Croatian words with the selection of the English translation.
- Querying English words with writing the word in English for spelling checks.
- Querying English words in textual form with recording pronunciation in an audio file.

## Language Flexibility

Although the example predominantly uses English for clarity, the application supports various languages, with dictionaries tagged for specific languages. The language tag is displayed when presenting dictionaries to students.

## User Roles

Administrators are users with the highest privileges and can define other administrators with equal permissions. Student accounts are independent and self-registering, allowing them to delete their accounts.

---

*This project is a part of the Software Engineering course (FlipMemo) at the Department of Electronics, Microelectronics, Computer and Intelligent Systems, University of Zagreb.*
