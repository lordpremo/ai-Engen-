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
    <html>
      <head>
        <title>${process.env.OWNER_NAME} — AI API</title>
        <style>
          body { background:#020617; color:#e5e7eb; font-family:system-ui; padding:24px; }
          h1 { color:#38bdf8; }
          code { background:#020617; padding:2px 6px; border-radius:4px; }
          .card { border:1px solid #1f2937; border-radius:10px; padding:12px; margin-top:10px; }
          .ep { color:#a855f7; font-weight:600; }
        </style>
      </head>
      <body>
        <h1>${process.env.OWNER_NAME} — Multi AI API</h1>
        <p>Base URL: <code>https://your-render-domain.onrender.com</code></p>

        <div class="card">
          <div class="ep">POST /chat</div>
          <p>LLM chat using Groq.</p>
          <pre>
Body:
{
  "prompt": "Hello"
}
          </pre>
        </div>

        <div class="card">
          <div class="ep">POST /image</div>
          <p>Generate image using Stability AI.</p>
          <pre>
Body:
{
  "prompt": "a lion wearing sunglasses, neon cyberpunk"
}
          </pre>
        </div>

        <div class="card">
          <div class="ep">GET /search?q=</div>
          <p>Web search using SearchAPI.io.</p>
          <pre>
GET /search?q=facebook
          </pre>
        </div>

        <div class="card">
          <div class="ep">POST /voice</div>
          <p>Speech-to-text using Deepgram.</p>
          <pre>
Body:
{
  "audio_url": "https://example.com/audio.mp3"
}
          </pre>
        </div>

        <p>Made by <b>${process.env.OWNER_NAME}</b></p>
      </body>
    </html>
  `);
});

// ---------------------- CHAT (GROQ) ----------------------
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    const r = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ response: r.data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

// ---------------------- IMAGE (STABILITY) ----------------------
app.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    const r = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        model: "stable-image-core",
        prompt,
        output_format: "png",
        aspect_ratio: "1:1"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    // r.data.image mara nyingi huwa base64
    res.json({ image: r.data.image });
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

// ---------------------- SEARCH (SEARCHAPI.IO) ----------------------
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "q is required" });

    const r = await axios.get(
      "https://www.searchapi.io/api/v1/search",
      {
        params: {
          engine: "google",
          q
        },
        headers: {
          Authorization: `Bearer ${process.env.SEARCHAPI_KEY}`
        }
      }
    );

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

// ---------------------- VOICE (DEEPGRAM) ----------------------
app.post("/voice", async (req, res) => {
  try {
    const { audio_url } = req.body;
    if (!audio_url) return res.status(400).json({ error: "audio_url is required" });

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

    const transcript =
      r.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    res.json({ text: transcript, raw: r.data });
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
