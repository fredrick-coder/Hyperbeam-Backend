const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = 'sk_test_YRAu-ZzhI8jVskPb2zmIRnZPyMyhoexo1UnQTrnTr0c';

// Health check to confirm server is awake
app.get('/', (req, res) => res.send("Proxy is online and ready!"));

app.post('/start-session', async (req, res) => {
    try {
        // 1. Check for existing sessions
        const active = await axios.get('https://hyperbeam.com', {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        // 2. If a session exists, send the FIRST one as a single object
        if (active.data && active.data.length > 0) {
            console.log("Existing session found. Sending to client...");
            return res.json(active.data[0]); 
        }

        // 3. Otherwise, create a new one
        console.log("Creating new VM...");
        const response = await axios.post('https://hyperbeam.com', {
            start_url: "https://google.com",
            kiosk: false
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

