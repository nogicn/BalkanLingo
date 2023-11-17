# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY app/ ./

# Expose port 3000
EXPOSE 3000

# Run npm start when the container launches
CMD ["npm","run", "start"]