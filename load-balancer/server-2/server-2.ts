import express from 'express'

const app = express();

app.get('/health', (req, res) => {
  res.status(500).send('server-2');
});

app.get('/', (req, res) => {
  res.send("Backend Server 2");
});

app.listen(8002, () => {
  console.log('Backend server 2 is running on port 8002');
});
