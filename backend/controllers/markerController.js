const path = require('path');
const fs = require('fs').promises;

// Helper to get file path for a specific blueprint
const getMarkerFilePath = (blueprintName) => {
  return path.join(__dirname, `../data/markers-${blueprintName}.json`);
};

exports.getMarkers = async (req, res) => {
  try {
    const { name } = req.params;
    const filePath = getMarkerFilePath(name);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If file doesn't exist, return empty array
        return res.json([]);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error reading markers:', error);
    res.status(500).json({ error: 'Failed to load markers' });
  }
};

exports.saveMarkers = async (req, res) => {
  try {
    const { name } = req.params;
    const markers = req.body;
    const filePath = getMarkerFilePath(name);

    // Validate markers
    if (!Array.isArray(markers)) {
      return res.status(400).json({ error: 'Invalid markers data' });
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(markers, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving markers:', error);
    res.status(500).json({ error: 'Failed to save markers' });
  }
};
