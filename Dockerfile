# Use an official Node.js image as the base (lightweight Alpine variant)
FROM node:24-alpine3.21

# Set environment variables for MongoDB credentials
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password \
    NODE_ENV=production

# Create app directory inside the container
WORKDIR /home/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY ./app/package*.json ./

# Install dependencies (production-only to keep image small)
RUN npm install --production

# Copy the rest of the application code
COPY ./app /home/app

# Expose the port the app runs on
EXPOSE 3000

# Define the default command to run the app
CMD ["node", "server.js"]
