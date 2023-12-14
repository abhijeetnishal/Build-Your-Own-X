# Social Media Application
Welcome to the "Build Your Own Social media application" project! This project aims to recreate the core functionality of the popular social media platform Twitter(now X.com). Users can register, log in, post tweets, follow other users, and interact with their timeline. This repository contains the codebase and configurations for both the frontend and backend of the Twitter Clone project.
<br>

## Table of Contents
- [**Features**](#features)
- [**Technologies**](#technologies)
- [**Future Enhancement**](#usage)
- [**Installation**](#installation)
- [**Usage**](#usage)
  <br>

## Features
- ***User Registration, Login, and Logout***: Users can create accounts, log in using their credentials, and log out when they're done.
- ***Tweet Management***: Authenticated users can post new tweets, edit their existing tweets, and delete their own tweets.
- ***Timeline***: The home page displays a chronological timeline of tweets from users the authenticated user is following, as well as their own tweets.
- ***Profile Page***: Users have their own profile page where they can view their followers and the users they are following.
- ***Error handling and validation***
- ***Caching with Redis***

<br>

## Technologies
The project utilizes the following technologies:
- **Backend**:
  - ***Node.js***: The backend of the application is built using Node.js, providing a fast and scalable runtime environment.
  - ***Express.js***: A web application framework for Node.js for rapid development.
  - ***MongoDB***: MongoDB serves as the database for storing user data, tweets, and other relevant information.
  - ***TypeScript***: TypeScript is used throughout the project to ensure strong type safety and enhance the development process.
  - ***Redis***: Redis is utilized for caching purposes, improving the overall performance of the application by reducing database queries.
    <br>
- **Frontend**:
  - ***Next.js***: A React framework for building server-side rendered and statically generated web applications.
  - ***TypeScript***: TypeScript is used throughout the project to ensure strong type safety and enhance the development process.
  - ***Tailwind CSS***: Tailwind CSS is used for styling the frontend, offering a utility-first approach and speeding up the design process.
    <br>
- ***Deployment***:
    - Both the frontend and backend of this project are deployed on ***Vercel, a serverless platform*** that provides easy deployment and scaling capabilities. This ensures that the application remains responsive and accessible to users at all times.

<br>

## Future Enhancement
- Functionality for ***Image and Video*** post. Image and video stored on the cloud and rendered into client side using ***signed URL***
- Social login using Google
- Using ***GraphQL***

## Installation
- To install the application locally, follow these steps:
  1. Star this repo to support my work and Fork the repo to create your own copy to work from.
  2. Clone the repository to your local machine using:
```bash
        git clone https://github.com/abhijeetnishal/Twitter-Clone.git
```
  3. Navigate to the Server directory using command "cd server" and create a .env file and copy contents of .env.example file to .env file and add all secret keys to setup MongoDB database, Redis, etc.
  4. Install dependencies in server directory of project:
```bash
     npm install
```
  5. Start the server using comand:
```bash
     npm start
```
  6. Now navigate to client directory of project using commands:
```bash
     cd ..
     cd client
```
  7. Install dependencies in client directory of project:
```bash
     npm install
```
  8. Start the application using command:
```bash
     npm run dev
```
  9. Open http://localhost:3000 in your browser to see the application.

<br>

## Usage
- To use the application, follow these steps:
  1. Register a new account with your username and password.
  2. Log in to the application using username and passsword.
  3. In Home page create, edit or delete post for our own and and see posts of following users.
  4. In profile page, you can see followers and following list in chronological manner.
<br>

## Contact
- If you have any questions or suggestions with the app, please feel free to contact on LinkedIn: https://www.linkedin.com/in/abhijeetkumar7565/
- I appreciate your feedback and would love to hear from you!