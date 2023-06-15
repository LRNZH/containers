# Use the official Node.js 14 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the frontend
RUN npm run build

# Expose the port on which the backend will run
EXPOSE 3002

# Start the backend
CMD ["npm", "run", "startBE"]