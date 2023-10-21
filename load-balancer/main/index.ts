import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy'
import { createServer } from 'http'
import axios from 'axios';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

//configure env
dotenv.config();

//create an express instance
const app = express();

//To parse the incoming requests with JSON we are using express.json() which is a built-in middleware function in Express.
app.use(express.json());

//The cookie-parser middleware is used to parse cookies from incoming requests, making them available in the req.cookies object.
app.use(cookieParser());

//Define port
const port = process.env.PORT || 8000;

//This will allow the user in the frontend to consume the APIs that you have created without any problem.
app.use(cors());


const proxy = httpProxy.createProxyServer();

//Define your backend servers with health check status.
const backendServers = [
  { url: 'http://localhost:8001', isHealthy: true },
  { url: 'http://localhost:8002', isHealthy: true },
  { url: 'http://localhost:8003', isHealthy: true },
];

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds

function performHealthCheck(server: any) {
  axios
    .get(`${server.url}/health`)
    .then(() => {
      server.isHealthy = true;
    })
    .catch(() => {
      server.isHealthy = false;
    });
}

//Periodically check the health of the backend servers.
setInterval(() => {
  backendServers.forEach(performHealthCheck);
}, HEALTH_CHECK_INTERVAL);

// Round-robin load balancing middleware with health check and error handling.
let currentServerIndex = 0;

app.use((req, res) => {
  let retries = 0;

  function getNextServer() {
    if (retries < backendServers.length) {
      const server = backendServers[currentServerIndex];
      currentServerIndex = (currentServerIndex + 1) % backendServers.length;
      if (server.isHealthy) {
        return server;
      } else {
        retries++;
        return getNextServer();
      }
    } else {
      return null;
    }
  };

  const targetServer = getNextServer();

  if(targetServer){
    proxy.web(req, res, { target: targetServer.url });
  } 
  else {
    res.status(503).send('All backend servers are unhealthy');
  }
});

// Create a server to listen to incoming requests.
const server = createServer(app);

server.listen(port, () => {
  console.log(`Load balancer listening on port ${port}`);
});