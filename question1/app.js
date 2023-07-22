const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'No URLs provided or invalid format' });
  }

  try {
    const responses = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url, { timeout: 500 });
          if (response.status === 200 && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
          }
          return [];
        } catch (error) {
          return [];
        }
      })
    );

    const mergedNumbers = [...new Set(responses.flat())].sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`number-management-service is running on port ${PORT}`);
});