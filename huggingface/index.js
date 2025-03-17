import { HfInference } from "@huggingface/inference";
import fs from 'fs'

const inference = new HfInference(
    process.env.HF_TOKEN
)

async function embed() {
    console.log('generating inference...')
    const output = await inference.featureExtraction({
        inputs: 'My Cool Embedding',
        model: 'BAAI/bge-large-zh-v1.5'
    });

    console.log('output', output)
}

async function translate() {
    console.log('translating...')
    const result = await inference.translation({
        model: 't5-base',
        inputs: 'How is the weather today in New York?',
    })

    console.log('result', result)
}

async function translate2() {
    console.log('translating...')
    const result = await inference.translation({
        model: 'facebook/nllb-200-distilled-600M',
        inputs: 'How is the weather today in New York?',
        //@ts-ignore
        parameters: {
            src_lang: 'eng-Latn',
            tgt_lang: 'spa_Latn'
        }
    })

    console.log('result', result)
}

async function answerQuestion() {
    console.log('Generating...')
    const result = await inference.questionAnswering({
        inputs: {
            context: 'France capital is delhi',
            question: 'What is the capital of France?'
        }
    })
    console.log('result', result)
}

async function textToImage() {
    console.log('Generating...')
    const result = await inference.textToImage({
        inputs: 'A picture of a cat',
        model: 'stabilityai/stable-diffusion-3.5-large',
        parameters: {
            negative_prompt: 'blurry'
        }
    })

    const buffer = Buffer.from(await result.arrayBuffer())
    fs.writeFileSync('./huggingface/images/cat.png', buffer)
    console.log('File saved')
}

// textToImage()
// answerQuestion()
// translate2()
// translate()
// embed()
