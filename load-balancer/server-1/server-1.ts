import express from 'express'

const app = express();

app.get('/health', (req, res) => {
  res.status(200).json('server-1');
});

app.get('/', (req, res) => {
  res.send('Backend Server 1');
});

app.listen(8001, () => {
  console.log('Backend server 1 is running on port 8001');
});
