# Description

BalkanLingo is an application for learning a foreign language based on the spaced repetition principle. It facilitates learning new words by presenting a series of questions about words from a defined word base. The learner answers questions by selecting the correct translation from the provided alternatives. The application adjusts the learning pace based on the accuracy of the responses, moving words through containers with time intervals for repetition.

# Features

- **Word Administrator**: Addition, editing, and deletion of foreign language words. Ability to add definitions, phrases, translated translations, and audio pronunciation files.
- **Dictionaries**: Organization of words into dictionaries. Creating new dictionaries and adding words to existing ones.
- **Learning Modes**: Different learning methods, including translation testing, pronunciation, and word writing.
- **Student Accounts**: Registration via email. Ability to change password and learn from selected dictionaries.

# Available Accounts
- **Admin Account**
  - Email: admin@balkanlingo.online
  - Password: 123
- **User Account**
  - Email: user@balkanlingo.online
  - Password: 123

# Implementation

- **Word Administrator Interface**: Allows adding new words, editing existing ones, defining phrases and translated translations, and adding audio pronunciation files.
- **Student Interface**: Registration, selection of dictionaries for learning, and choice of learning modes.
- **Integration with External Dictionaries**: Use of application interfaces to accept words and their descriptions from external sources.

# Additional Information

- **Language**: Although an example of the English language was used for easier understanding, the application is adaptable for learning any language.
- **Administrators**: Users with the highest privileges. They are created by the root administrator who can define other administrators with the same privileges.

# Publicly Accessible Website
- The website is publicly accessible at: [balkanlingo.online](https://balkanlingo.online)

# Before you run
- Make sure to add your elevenlabs api key and change the gmail key in .env 
- Also make sure to update the origin email adress to be your own email in app/middleware/mail_middleware.js under user

# Manual Setup
To run the application manually, you'll need Node.js version 20 or higher.

1. Change directory to the "app" folder:
    ```bash
    cd IzvorniKod/app
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```
    If you encounter an Axios error, try installing Axios globally with:
    ```bash
    npm install -g axios
    ```

3. Start the application:
    ```bash
    npm run start
    ```
    The application runs on the default port 3000.

# Docker Setup
To run the application using Docker:

1. Change directory to the "IzvorniKod" folder:
    ```bash
    cd IzvorniKod
    ```

2. Build a Docker image named "balkan-lingo":
    ```bash
    docker build -t balkan-lingo .
    ```

3. Run the Docker container and map port 3000 from the container to your host:
    ```bash
    docker run -p 3000:3000 balkan-lingo
    ```
    To run the container in the background, use:
    ```bash
    docker run -d -p 3000:3000 balkan-lingo
    ```

# Stopping the Docker Container
To stop a Docker container:

1. List all running containers:
    ```bash
    docker ps -a
    ```

2. Stop the container using its CONTAINER_ID:
    ```bash
    docker stop <CONTAINER_ID>
    ```

Replace `<CONTAINER_ID>` with the actual ID of the container you want to stop.