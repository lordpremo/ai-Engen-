import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ---------------------- HOME PAGE ----------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>${process.env.OWNER_NAME} — Multi AI API</h1>
    <p>Welcome to your unified AI API. Below are available endpoints:</p>

    <ul>
      <li><b>POST /chat</b> — Chat LLM (Groq)</li>
      <li><b>POST /image</b> — Generate Image (Stability)</li>
      <li><b>POST /video</b> — Generate Video (Groq)</li>
      <li><b>POST /voice</b> — Speech-to-Text (Deepgram)</li>
      <li><b>GET /search?q=</b> — Web Search (SearchAPI.io)</li>
    </ul>

    <p>Made by <b>${process.env.OWNER_NAME}</b></p>
  `);
});

// ---------------------- CHAT ----------------------
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const r = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );

    res.json({ response: r.data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------- IMAGE GENERATION ----------------------
app.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const r = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_KEY}`,
          Accept: "application/json"
        }
      }
    );

    res.json({ image: r.data.image });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------- VIDEO GENERATION ----------------------
app.post("/video", async (req, res) => {
  try {
    const { prompt } = req.body;

    const r = await axios.post(
      "https://api.groq.com/openai/v1/videos",
      { prompt },
      { headers: { Authorization: `Bearer ${process.env.GROQ_KEY}` } }
    );

    res.json({ video: r.data.video_url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------- VOICE TRANSCRIPTION ----------------------
app.post("/voice", async (req, res) => {
  try {
    const { audio_url } = req.body;

    const r = await axios.post(
      "https://api.deepgram.com/v1/listen",
      { url: audio_url },
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ text: r.data.results.channels[0].alternatives[0].transcript });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------- SEARCH ----------------------
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    const r = await axios.get(
      `https://www.searchapi.io/api/v1/search?engine=google&q=${q}&api_key=${process.env.SEARCHAPI_KEY}`
    );

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------- START ----------------------
app.listen(3000, () => console.log("API running"));
