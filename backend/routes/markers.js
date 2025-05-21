// ---
// Example curl commands for testing this API:
//
// 1. Save markers (POST):
// curl -X POST http://localhost:3000/api/markers/save \\
//   -H "Content-Type: application/json" \\
//   -d '[{"id":1,"x":100,"y":200,"label":"A"}]'
//
// 2. Get markers (GET):
// curl http://localhost:3000/api/markers
// ---
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/save/:name', (req, res) => {
  const markers = req.body;
  const blueprintName = req.params.name;
  const filePath = path.join(__dirname, `../data/markers-${blueprintName}.json`);

  // Validate input: must be an array of objects with x, y, and label
  if (!Array.isArray(markers) || !markers.every(m => m && typeof m.x === 'number' && typeof m.y === 'number' && typeof m.label === 'string')) {
    console.warn(`[POST /api/markers/save/${blueprintName}] Bad request: Invalid marker data:`, markers);
    return res.status(400).json({ success: false, error: 'Invalid marker data. Must be an array of objects with x, y, and label.' });
  }

  try {
    fs.writeFile(filePath, JSON.stringify(markers, null, 2), (err) => {
      if (err) {
        console.error(`[POST /api/markers/save/${blueprintName}] Failed to save markers:`, err);
        return res.status(500).json({ success: false, error: 'Failed to save markers' });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error(`[POST /api/markers/save/${blueprintName}] Unexpected error:`, err);
    res.status(500).json({ success: false, error: 'Unexpected server error' });
  }
});

router.get('/:name', (req, res) => {
  const blueprintName = req.params.name;
  const filePath = path.join(__dirname, `../data/markers-${blueprintName}.json`);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found: return empty array
        console.warn('[GET /api/markers] File not found, returning empty array.');
        return res.json([]);
      } else {
        console.error('[GET /api/markers] Failed to read markers file:', err);
        return res.status(500).json({ error: 'Failed to load markers' });
      }
    }
    try {
      const markers = JSON.parse(data);
      res.json(markers);
    } catch (parseErr) {
      console.error('[GET /api/markers] Invalid JSON in markers file:', parseErr);
      res.status(500).json({ error: 'Corrupted markers file' });
    }
  });
});

module.exports = router;
