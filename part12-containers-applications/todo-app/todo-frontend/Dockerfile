FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Set the backend URL environment variable
ENV REACT_APP_BACKEND_URL=http://localhost:8000/api

# Expose the port on which the frontend will run
ENV PORT 3001

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Start the frontend application
CMD ["npm", "start"]
