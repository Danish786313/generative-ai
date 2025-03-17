import { round, pipeline } from '@xenova/transformers'
// import wavefile from 'wavefile'
function test() {
    const result = round(5.555, 7)
    console.log("result", result)
}

async function embeddor() {
    console.log("Generating...")
    const embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
    )

    const result = await embedder('First local embedding', {
        pooling: 'mean',
        normalize: true
    })
    console.log("result", result)
}

// async function generateText() {
//     try {
//         console.log("Generating...")
//         const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M')
//         let result = await generator('Give me a list of good books', {
//             max_new_tokens: 200,
//             temperature: 0.7,
//             repetition_penalty: 2.0
//         })
//         console.log("generated", result)
//     } catch (err) {
//         console.log(err)
//     }
// }
async function speechRecognition() {
    let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small.en');
    let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
    let buffer = Buffer.from(await fetch(url).then(x => x.arrayBuffer()))

    let wav = new wavefile.WaveFile(buffer);
    wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
    wav.toSampleRate(16000);

    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
        if (audioData.length > 1) {
            const SCALING_FACTOR = Math.sqrt(2);
            // Merge channels (into first channel to save memory)
            for (let i = 0; 1 < audioData[0].length; ++i) {
                audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
            }
        }

        // select fist channel
        audioData = audioData[0];

        // transcribe an audio title, loaded from a url
        let result = await transcriber(audioData)
        console.log(result)
    }
}

// generateText()
// embeddor()
// test()