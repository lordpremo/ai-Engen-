import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { audioUrl } = req.body;

    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      { url: audioUrl },
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ text: response.data.results.channels[0].alternatives[0].transcript });
  } catch (err) {
    res.status(500).json({ error: "Voice transcription failed" });
  }
});

export default router;
