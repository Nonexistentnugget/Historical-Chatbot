const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { predefinedResponses } = require('./responses');

const app = express();
app.use(cors());
app.use(express.json());

//status
app.get('/', (req, res) => {
    res.send('backend is now running');
});

app.post('/api/chat', async (req, res) => {
    const { message, userName, imperialFavour } = req.body;
    const lowerMsg = message.toLowerCase();
    let updatedFavour = imperialFavour ?? 50;

    // checking if the user's message matches the predefined keyword responses (SEE: responses.js)
    // BUG: Partial-word matching issue
    // right now, lowerMsg.includes("hi") triggers words like "this"
    const match = predefinedResponses.find((entry) =>
        entry.keywords.some((word) => lowerMsg.includes(word))
);

if (match) {
    updatedFavour = Math.max(0, Math.min(100, updatedFavour + match.favourChange));
    return res.json({
        reply: match.reply,
        imperialFavour: updatedFavour
    });
}

// TODO: 
//Connect an AI API here for unscripted questions
res.json({
    reply: `The Emperor is...UNSURE of what to say in response to, as you put it: "${message}", ${userName || 'Citizen'}. Try asking about something else...Something about me perhaps?`,
    imperialFavour: updatedFavour
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});