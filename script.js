document.getElementById('generateBtn').addEventListener('click', async () => {
	const inputText = document.getElementById('inputText').value;

	const lines = inputText.split(/\r?\n/);
	let convertedText = '';
	let currentSpeaker = '';

	for (let line of lines) {
		const trimmed = line.trim();
		if (trimmed === '') {
			convertedText += '\n';
			continue;
		}

		const match = trimmed.match(/^(\w+):\s*(.*)$/);
		if (match) {
			const speaker = match[1];
			const dialogue = match[2];

			// Only add new speaker tag if different from current
			if (speaker !== currentSpeaker) {
				currentSpeaker = speaker;
				convertedText += `[speaker:${speaker}]\n`;
			}
			convertedText += `${dialogue}\n\n`; // ← ensures extra space after dialogue
		} else {
			// For non-matching lines (multiline dialog), treat as continuation
			convertedText += `${trimmed}\n\n`;
		}
	}

	const modifiedText = convertedText
		.replace(/\[speaker:Takumi\][\s\S]*?(?=\[speaker:Mizuki\]|\[speaker:Takumi\]|$)/g, match => match.trim() + ' <break time="10s"/> ')
		.replace(/\[speaker:Mizuki\][\s\S]*?(?=\[speaker:Takumi\]|\[speaker:Mizuki\]|$)/g, match => match.trim());

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
