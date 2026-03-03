const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// CHAT - Groq
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Lord AI assistant.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Chat error', details: err.response?.data });
  }
});

// IMAGE - Stability AI
app.post('/image', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Image error', details: err.response?.data });
  }
});

// VIDEO - Stability AI
app.post('/video', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://api.stability.ai/v2beta/video/generate',
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Video error', details: err.response?.data });
  }
});

// VOICE → TEXT - Deepgram
app.post('/voice-to-text', async (req, res) => {
  try {
    const { audioUrl } = req.body;

    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      { url: audioUrl },
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: { model: 'nova-3' }
      }
    );

    res.json({
      transcript: response.data.results.channels[0].alternatives[0].transcript
    });
  } catch (err) {
    res.status(500).json({ error: 'Voice error', details: err.response?.data });
  }
});

// SEARCH - searchapi.io
app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      'https://www.searchapi.io/api/v1/search',
      {
        params: {
          engine: 'google',
          q,
          api_key: process.env.SEARCHAPI_KEY
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Search error', details: err.response?.data });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Lord AI API running on port ${PORT}`));
