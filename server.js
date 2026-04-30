const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const path = require('path');
const app = express();

const HYPERBEAM_API_KEY = 'sk_test_YRAu-ZzhI8jVskPb2zmIRnZPyMyhoexo1UnQTrnTr0c';

app.use(express.static('public')); // Serve frontend files from a 'public' folder

app.post('/create-session', async (req, res) => {
  try {
    const response = await fetch('https://engine.hyperbeam.com/v0/vm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYPERBEAM_API_KEY}`
      },
      body: JSON.stringify({
        start_url: 'https://google.com',
        kiosk: true,
        adblock: true,
        ublock: true,
        webgl: true,
        width: 1280,
        height: 720
      })
    });

    const data = await response.json();
    res.json(data); // Send session_id and embed_url to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
