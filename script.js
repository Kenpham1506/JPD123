document.getElementById('generateBtn').addEventListener('click', async () => {
	const inputText = document.getElementById('inputText').value;
	const modifiedText = inputText.replace(/\[speaker:Takumi\]/g, '[speaker:Takumi]')
		.replace(/\[speaker:Mizuki\]/g, '[speaker:Mizuki]')
		.replace(/\[speaker:Takumi\][\s\S]*?(?=\[speaker:Mizuki\]|$)/g, match => match.trim() + '  <break time="10s"/>')
		.replace(/\[speaker:Mizuki\][\s\S]*?(?=\[speaker:Takumi\]|$)/g, match => match.trim());

	const payload = new URLSearchParams();
	payload.append('msg', modifiedText);
	payload.append('lang', 'Takumi');
	payload.append('source', 'ttsmp3');

	try {
		const response = await fetch('https://cors-anywhere.herokuapp.com/https://ttsmp3.com/makemp3_new.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: payload
		});

		const result = await response.json();
		if (result.success && result.URL) {
			document.getElementById('audio').src = result.URL;
			document.getElementById('audioPlayer').style.display = 'block';
		} else {
			alert('Failed to generate audio. Please try again.');
		}
	} catch (error) {
		console.error(error);
		alert('An error occurred while generating the audio.');
	}
});
