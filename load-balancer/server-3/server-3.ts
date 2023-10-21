import express from 'express'

const app = express();

app.get('/health', (req, res) => {
  res.status(200).send('server-3');
});

app.get('/', (req, res) => {
  res.send('Backend Server 3');
});

app.listen(8003, () => {
  console.log('Backend server 3 is running on port 8003');
});
