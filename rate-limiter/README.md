## Rate Limiter
A simple rate limiter using the fixed window algorithm implemented in Node.js and Express.js. This rate limiter is designed to work with Redis to store IP addresses and their request counts per unit of time. It can be used to limit the number of requests a client can make to a specific endpoint, which is especially useful to prevent abuse or excessive usage.

### Features
- Rate limiting based on IP address.
- Utilizes Redis as a storage mechanism.
- Supports handling requests from different ports on the same IP address.

### Demo
![Demo Video](./Demo.gif)

### Technologies
- **Node.js**: A JavaScript runtime for server-side development.
- **Express.js**: A web application framework for Node.js.
- **PostgreSQL**: A powerful open-source relational database management system.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Redis**: An in-memory data structure store used as a cache.

### Setup project on your local machine
- To install the application locally, follow these steps:

1. Clone the repository to your local machine using:
```bash
    git clone https://github.com/abhijeetnishal/Build-Your-Own-X.git
```
2. Move to the rate-limiter folder using command:
```bash
cd rate-limiter
```
3. Create a .env file in root directory and copy contents of .env.example file to .env file and add all secret keys details to setup postgres database and Redis.

4. Install dependencies in root directory of project using command:
```bash
    npm install
```

5. Start the server using comand:
```bash
    npm start
```

6. Open postman or any other API testing tools and use http://localhost:8080/posts as URL and select GET request and send request. If everything works fine, server sends blog posts details as a response. Send the requests 3-4 times continuously to see the result.
