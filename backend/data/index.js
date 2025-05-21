const express = require('express');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
const markerRoutes = require('../routes/markers');
app.use('/api/markers', markerRoutes);

// Default route for sanity check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
