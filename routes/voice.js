import express from "express";
import axios from "axios";
import fs from "fs-extra";
const router = express.Router();

router.post("/", async (req, res) => {
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

export default router;
