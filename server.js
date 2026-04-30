const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = 'sk_test_YRAu-ZzhI8jVskPb2zmIRnZPyMyhoexo1UnQTrnTr0c';

// 1. Health Check - Visit https://onrender.com to see this
app.get('/', (req, res) => {
    res.send("Proxy is online and ready!");
});

// 2. The Start Session Endpoint
app.post('/start-session', async (req, res) => {
    try {
        console.log("Request received to start session...");

        // Check for existing sessions first to avoid 429 Rate Limits
        const activeSessions = await axios.get('https://hyperbeam.com', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        // If a VM is already running, just return that one
        if (activeSessions.data && activeSessions.data.length > 0) {
            console.log("Existing session found. Reusing...");
            return res.json(activeSessions.data[0]); 
        }

        // If no VM exists, create a brand new one
        console.log("No existing sessions. Creating new VM...");
        const response = await axios.post('https://hyperbeam.com', {
            start_url: "https://google.com",
            kiosk: false
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Hyperbeam Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

