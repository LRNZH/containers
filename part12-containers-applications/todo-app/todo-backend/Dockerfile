# Use the official Node.js 16 image as the base image
FROM node:16

# Install MongoDB client tools
RUN apt-get update && apt-get install -y mongo-tools

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]