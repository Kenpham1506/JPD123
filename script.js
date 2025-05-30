document.getElementById('generateBtn').addEventListener('click', async () => {
	const inputText = document.getElementById('inputText').value;

	const lines = inputText.split(/\r?\n/);
	const entries = [];

	for (let line of lines) {
		const trimmed = line.trim();
		if (trimmed === '') continue;

		const match = trimmed.match(/^(\w+):\s*(.*)$/);
		if (match) {
			const speaker = match[1];
			const dialogue = match[2];

			let entry = `[speaker:${speaker}] ${dialogue}`;

			if (speaker === 'Takumi') {
				entry += ' <break time="8s"/>';
			}
			entries.push(entry);
		}
	}

	const modifiedText = entries.join('  '); // space between entries, not newline

	const payload = new URLSearchParams();
	payload.append('msg', modifiedText);
	payload.append('lang', 'Takumi');
	payload.append('source', 'ttsmp3');

	try {
		const response = await fetch('https://jpd123.onrender.com/api/tts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: payload
		});

		const result = await response.json();
		console.log("TTS API response:", result);

		if ((result.success || result.URL) && result.URL) {
			const proxiedURL = `https://jpd123.onrender.com/api/stream?url=${encodeURIComponent(result.URL)}`;
			const audio = document.getElementById('audio');
			audio.src = proxiedURL;
			audio.load();

			console.log("Calling audio.play()");
			try {
				await audio.play();
				console.log("Playback started");
			} catch (err) {
				console.warn("Autoplay blocked:", err.message);
			}

			document.getElementById('audioPlayer').style.display = 'block';
		} else {
			alert('Failed to generate audio. Please try again.');
		}
	} catch (error) {
		console.error("Fetch error:", error);
		alert('An error occurred while generating the audio.');
	}
});
