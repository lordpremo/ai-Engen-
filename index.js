import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs-extra";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ---------------- HOME ----------------
app.get("/", (req, res) => {
  res.send("BROKEN LORD AI CORE is running.");
});

// ---------------- CHAT (GROQ) ----------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Chat failed", details: err.message });
  }
});

// ---------------- SEARCH (SearchAPI.io) ----------------
app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.get(
      `https://www.searchapi.io/api/v1/search?q=${query}&engine=google`,
      {
        headers: { Authorization: `Bearer ${process.env.SEARCH_API_KEY}` }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ---------------- VOICE (Deepgram – base64) ----------------
app.post("/api/voice", async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    const buffer = Buffer.from(audioBase64, "base64");
    const tempFile = "./temp_audio.webm";

    await fs.writeFile(tempFile, buffer);

    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      fs.createReadStream(tempFile),
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/webm"
        }
      }
    );

    await fs.remove(tempFile);

    res.json({
      text: response.data.results.channels[0].alternatives[0].transcript
    });
  } catch (err) {
    res.status(500).json({ error: "Voice transcription failed" });
  }
});

// ---------------- VIDEO (Stability AI) ----------------
app.post("/api/video", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-video/generate",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Video generation failed" });
  }
});

// ---------------- START SERVER ----------------
app.listen(process.env.PORT || 5000, () =>
  console.log("BROKEN LORD AI CORE is running...")
);
