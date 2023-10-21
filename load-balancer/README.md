## Load Balancer
Welcome to the "Build Your Own Load Balancer" project! This repository contains a basic load balancer implemented using the Round Robin algorithm. The load balancer distributes incoming requests to different servers to ensure efficient utilization and improved reliability.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
3. [Technologies](#technologies)
4. [Getting Started](#getting-started)

### Overview
Load balancers play a crucial role in distributing traffic efficiently across multiple servers. In this project, we have implemented a basic load balancer using the round-robin algorithm. The load balancer ensures that each server receives a fair share of incoming requests, optimizing server performance and providing redundancy.

### Features
1. **Round-Robin Load Balancing**: Incoming requests are distributed evenly across multiple server instances.
2. **Periodic Health Checks**: The load balancer periodically checks the health of each server by making requests to the /health endpoint of each server every 5 seconds.
3. **Error Handling**: The project includes error handling to gracefully handle server failures or other issues.

### Project Structure
The repository is organized as follows: 
1. **main**: This folder contains the main load balancer server file.  <br>
2. **server-1, server-2, server-3**: These folders contain individual server files where the load is distributed.

### Technologies
- **Node.js**: A JavaScript runtime for server-side development.
- **Express.js**: A web application framework for Node.js.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

### Getting Started
- To install the application locally, follow these steps:

1. Clone the repository to your local machine using:
```bash
    git clone https://github.com/abhijeetnishal/Build-Your-Own-X.git
```
2. Move to the load-balancer folder using command:
```bash
    cd load-balancer
```

3. Install dependencies in root directory of project using command:
```bash
    npm install
```

4. Move to main folder to run load-balancer server using command:
```bash
    cd main
```

5. Start the main load-balancer server using comand:
```bash
    npm start
```

6. Repeat step 3, 4 and 5 to run server-1, seerver-2 and server-3 independently.

7. Test the application using postman or CURL by sending a GET requests continuously to http://localhost:8000/.

8. Check the health functionality by changing status code(200 to 500) in any one of the server files and start sending requests.