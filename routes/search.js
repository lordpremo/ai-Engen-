import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
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

export default router;
