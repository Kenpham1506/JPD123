const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle POST request to TTS API
app.post('/api/tts', async (req, res) => {
	try {
		const response = await axios.post(
			'https://ttsmp3.com/makemp3_new.php',
			new URLSearchParams(req.body).toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		res.json(response.data);
	} catch (err) {
		console.error('TTS API error:', err?.response?.data || err.message);
		res.status(500).json({ error: 'Proxy request failed' });
	}
});

// Stream MP3 audio from ttsmp3.com
app.get('/api/stream', async (req, res) => {
	const url = req.query.url;

	if (!url || !url.startsWith('https://ttsmp3.com/created_mp3/')) {
		return res.status(400).json({ error: 'Invalid or missing MP3 URL' });
	}

	try {
		const response = await axios.get(url, {
			responseType: 'stream',
			headers: {
				'User-Agent': 'Mozilla/5.0',
				'Referer': 'https://ttsmp3.com/',
			},
		});

		res.setHeader('Content-Type', 'audio/mpeg');
		response.data.pipe(res);
	} catch (err) {
		console.error('MP3 stream error:', err.message);
		res.status(500).json({ error: 'Failed to stream MP3' });
	}
});

app.get('/', (req, res) => {
	res.send('TTS Proxy Server is running.');
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
