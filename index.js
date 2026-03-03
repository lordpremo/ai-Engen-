import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoute from "./routes/chat.js";
import imageRoute from "./routes/image.js";
import searchRoute from "./routes/search.js";
import voiceRoute from "./routes/voice.js";
import videoRoute from "./routes/video.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/chat", chatRoute);
app.use("/api/image", imageRoute);
app.use("/api/search", searchRoute);
app.use("/api/voice", voiceRoute);
app.use("/api/video", videoRoute);

// HOMEPAGE DOCS
app.get("/", (req, res) => {
  res.send(`
    <h1>BROKEN LORD AI CORE</h1>
    <p>Welcome to the official AI API.</p>

    <h2>Available Endpoints</h2>
    <ul>
      <li>POST /api/chat → Groq Chat</li>
      <li>POST /api/image → Stability Image Generation</li>
      <li>POST /api/search → SearchAPI.io Web Search</li>
      <li>POST /api/voice → Deepgram Speech-to-Text</li>
      <li>POST /api/video → Stability Video Diffusion</li>
    </ul>

    <h3>How to Use</h3>
    <p>Send JSON body with required fields. Add your API keys in .env</p>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BROKEN LORD AI running on port ${PORT}`));
