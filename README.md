# Available Accounts
- **Admin Account**
  - Email: admin@gmail.com
  - Password: 123
- **User Account**
  - Email: user@gmail.com
  - Password: 123

# Adding users
- First go to "Registriraj se", after registration you will be redirected after 5 seconds.
- After registering go to "Prijavi se" and click on "Ne znaš lozinku"
- ** this is temporary** enter email and the password you want
- You are redirected to "Prijavi se" and log in

# Reset password
- Go to "Prijavi se" and click on "Ne znaš lozinku"
- ** this is temporary** enter email and the password you want
- You are redirected to "Prijavi se" and log in

# Publicly Accessible Website
- The website is publicly accessible at: [138.201.184.55:3000](http://138.201.184.55:3000)

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

1. Change directory to the "app" folder:
    ```bash
    cd IzvorniKod/app
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
