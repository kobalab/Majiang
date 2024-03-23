// server.js
const path = require('path');
const express = require('express');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.resolve(__dirname, 'docs')));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
