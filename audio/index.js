import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
});

async function createTranscription() {
    console.log("Creating transcription...");
    // OpenAI supports audio files up to 5 minutes in size and 48kHz sampling rate.
	const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream("./resourse/sample-audio.mp3"),
		model: "whisper-1",
		language: "en",
    });

    console.log("Transcription:", response);
    const timestamp = Date.now();
    fs.writeFileSync(`./audio/responses/audio-transcription-${timestamp}.txt`, response.text);
}

async function translate() {
    console.log("Translating...");
    const response = await openai.audio.translations.create({
        file: fs.createReadStream("./resourse/sample-audio.mp3"),
        model: "whisper-1",
    });
    
}

async function textToSpeech() {
    console.log("Converting text to speech...");
    const sampleText = "So Descript is different. Let's start here. Descript basically, when you record a video, it transcribes the video. And instead of just working with a timeline and cutting and trying to merge the other clips."
    const response = await openai.audio.speech.create({
        input: sampleText,
        model: "tts-1",
        voice: "alloy",
        response_format: 'mp3'
    });
    const buffer = Buffer.from(await response.arrayBuffer())
    const timestamp = Date.now();
    fs.writeFileSync(`./audio/responses/sample-text-to-speech-${timestamp}.mp3`, buffer);
}
// createTranscription()
// textToSpeech()