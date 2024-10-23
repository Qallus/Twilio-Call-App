const express = require('express');
const app = express();

// API to get agent data
app.get('/api/agents', (req, res) => {
    // Pull data from SQLite database
    res.json({
        agentsAvailable: 12,
        agentsOnCall: 5,
        agentsAway: 3,
    });
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
