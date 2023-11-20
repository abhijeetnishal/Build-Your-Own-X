# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app source
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Specify the command to run on container start
CMD ["npm", "run", "dev"]
