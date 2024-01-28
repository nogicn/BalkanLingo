# Available Accounts
- **Admin Account**
  - Email: admin@balkanlingo.online
  - Password: 123
- **User Account**
  - Email: user@balkanlingo.online
  - Password: 123

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