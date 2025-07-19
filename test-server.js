import express from 'express';
const app = express();

app.get('/test-docs', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.listen(3000, () => {
  console.log('Test server listening on port 3000');
});