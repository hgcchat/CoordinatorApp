const express = require('express');
const app = express();
const PORT = 5000;

const markerRoutes = require('./routes/markers');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/markers', markerRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
