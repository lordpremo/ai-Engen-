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
app.use(express.json({ limit: "50mb" }));

app.use("/api/chat", chatRoute);
app.use("/api/image", imageRoute);
app.use("/api/search", searchRoute);
app.use("/api/voice", voiceRoute);
app.use("/api/video", videoRoute);

app.get("/", (req, res) => {
  res.send("BROKEN LORD AI CORE is running.");
});

app.listen(process.env.PORT || 5000);
