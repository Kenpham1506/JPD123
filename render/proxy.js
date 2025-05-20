// proxy.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/tts', async (req, res) => {
	try {
		const response = await axios.post(
			'https://ttsmp3.com/makemp3_new.php',
			new URLSearchParams(req.body).toString(),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		);
		res.json(response.data);
	} catch (err) {
		console.error(err.response?.data || err.message);
		res.status(500).json({ error: 'Proxy request failed' });
	}
});

app.listen(3000, () => console.log('Proxy listening on http://localhost:3000'));
