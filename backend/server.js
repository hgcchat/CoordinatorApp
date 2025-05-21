const express = require('express');
const cors = require('cors');
const path = require('path');
const net = require('net');

const app = express();
const PREFERRED_PORT = process.env.PORT || 5000;
const MAX_PORT_ATTEMPTS = 10;

// Find an available port
const findAvailablePort = (startPort, maxAttempts) => {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryPort = (port) => {
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying next port...`);
          if (attempts >= maxAttempts) {
            reject(new Error('Could not find an available port'));
            return;
          }
          attempts++;
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        server.close(() => resolve(port));
      });

      server.listen(port);
    };

    tryPort(currentPort);
  });
};

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Coordinator backend is running.');
});

// Routes
const markerRoutes = require('./routes/markers');
app.use('/api/markers', markerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server with port finding logic
findAvailablePort(PREFERRED_PORT, MAX_PORT_ATTEMPTS)
  .then(port => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Access the API at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = app;
