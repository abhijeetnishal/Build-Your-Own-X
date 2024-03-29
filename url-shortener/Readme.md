# URL Shortener App

## Introduction
This is a web application for shortening URLs, created using ReactJS, NodeJS, ExpressJS, and MongoDB. The app allows users to enter a long URL, which is then shortened to a much shorter URL that can be easily shared. The shortened URL is redirectable to the original long URL. The app is live and can be accessed at the provided URL.

<br>

## Table of Contents
- [**Features**](#features)
- [**Technologies**](#technologies)
- [**Running the Application using docker**](#running-the-application-using-docker)
- [**Project Installation**](#project-installation)
- [**Usage**](#usage)
  
<br>

## Features
The app has the following features:
  1. URL shortening: Users can enter a long URL and get a shortened URL that can be easily shared.
  2. Redirects: The shortened URL redirects to the original long URL.

<br>

## Technologies
The app is built using the following technologies:
- ReactJS: A JavaScript library for building user interfaces.
- NodeJS: A JavaScript runtime for building server-side applications.
- ExpressJS: A lightweight framework for building web applications.
- MongoDB: A document-oriented NoSQL database.

<br>

## Running the Application using docker
1. Clone the repository:
```bash
   git clone https://github.com/abhijeetnishal/Build-Your-Own-X.git
```
2. Move to the url-shortener folder using below command:
```bash
    cd url-shortener
```
3. Move to server directory using below command:
```bash
    cd server
```
4. Create a .env file in root directory of server and copy contents of .env.example file to .env file and add MongoDB URI to setup database.
5. Make sure that docker is installed in your system. Run the below command to build docker image for server:
```bash
    docker build -t your_server_image_name .
```
6. Run a container based on your_server_image_name using below command, exposing port 8080 on the host machine and mapping it to port 8080 inside the container
```bash
    docker run -p 8080:8080 your_server_image_name
```
7. Now move to client directory using below command:
```bash
    cd ../client
```
8. Create a .env file in root directory of client and copy contents of .env.example file to .env file and add your backend URL.
9. Run the below command to build docker image for client:
```bash
    docker build -t your_client_image_name .
```
10. Run a container based on your_client_image_name using below command:
```bash
    docker run -p 3000:3000 your_client_image_name
```

<br>

## Project Installation:
1. Clone the repository to your local machine using:
```bash
    git clone https://github.com/abhijeetnishal/Build-Your-Own-X.git
```
2. Move to the url-shortener folder using command:
```bash
    cd url-shortener
```
3. Move to server directory:
```bash
    cd server
```
4. To install dependencies run the below command:
```bash
    npm install
```
5. Create a .env file in root directory of server and copy contents of .env.example file to .env file and add MongoDB URI to setup database.
6. Start the server using command:
```bash
    npm run dev
```
7. Now move to client folder:
```bash
    cd ../client
```
8. Create a .env file in root directory of client and copy contents of .env.example file to .env file and add your backend URL.
9. To install dependencies run the below command:
```bash
    npm install
```
10. start the react app using command:
```bash
    npm start
```

<br>

## Usage
To use the app, follow these steps:
1. Enter a long URL in the input field and click the "Shorten" button.
2. Copy the shortened URL and share it with others.
3. To view analytics data for a shortened URL, click the "Analytics" button next to the URL in the list.