import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
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
    res.status(500).json({ error: "Image generation failed" });
  }
});

export default router;
