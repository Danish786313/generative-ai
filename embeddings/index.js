import OpenAI from "openai";
import fs from "fs";
import path from 'path';
let __dirname = path.resolve() + '/embeddings';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbeddings(input) {
    console.log("Generating embeddings for the input:", input);
    const response = await openai.embeddings.create({
        input: input,
        model: "text-embedding-3-small",
    });

    console.log(response.data[0]);
    const timestamp = Date.now();
    fs.writeFileSync(`./embeddings/reponses/embeddings-${timestamp}.txt`, JSON.stringify(response));
    return response
}

export function loadJSONData(fileName) {
    const filePath = path.join(__dirname, fileName);
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data, fileName) {
    const dataString = JSON.stringify(data); 
    const dataBuffer = Buffer.from(dataString); 
    const filePath = path.join(__dirname, fileName); 
    fs.writeFileSync(filePath, dataBuffer); 
    console.log(`saved data to ${fileName}`); 
}

async function main() { 
    const data = loadJSONData('data2.json')
    const embeddings = await generateEmbeddings(data)
    const dataWithEmbeddings = []
    for (let i=0; i<data.length; i++) {
        dataWithEmbeddings.push({
            imput: data[i], 
            embedding: embeddings.data[i].embedding 
        })
    }
    saveDataToJsonFile(dataWithEmbeddings, 'data-with-embeddings2.json')
}

// main()

// generateEmbeddings('cat is on the roof')
// generateEmbeddings(['cat is on the roof', 'child is playing with ball'])