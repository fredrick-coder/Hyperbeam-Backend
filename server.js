const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = 'sk_test_YRAu-ZzhI8jVskPb2zmIRnZPyMyhoexo1UnQTrnTr0c';

app.post('/start-session', async (req, res) => {
    try {
        // First, check if you already have an active session to avoid rate limits
        const sessions = await axios.get('https://engine.hyperbeam.com/v0/vm', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (sessions.data && sessions.data.length > 0) {
            // Give back the first active session found
            return res.json(sessions.data[0]);
        }

        // If no active sessions, start a new one
        const response = await axios.post('https://engine.hyperbeam.com/v0/vm', {
            start_url: "https://google.com",
            kiosk: false
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
    }
});

app.listen(process.env.PORT || 8080);
