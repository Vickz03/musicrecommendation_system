const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

async function getSpotifyToken() {
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    data: 'grant_type=client_credentials',
  };
  async function getSpotifyToken() {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      },
      data: 'grant_type=client_credentials',
    };
  
    const response = await axios(authOptions);
    console.log('Spotify Token:', response.data.access_token); // Add this line
    return response.data.access_token;
  }
  

  const response = await axios(authOptions);
  return response.data.access_token;
}

app.get('/api/recommendations', async (req, res) => {
  const { genre } = req.query;
  const token = await getSpotifyToken();

  try {
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: { Authorization: `Bearer ${token}` },
      params: { seed_genres: genre, limit: 5 },
    });

    const recommendations = response.data.tracks.map(track => ({
      name: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify,
    }));

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).send('Error retrieving recommendations');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
