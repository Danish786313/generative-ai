import { loadJSONData, generateEmbeddings } from "./index.js";

function dotProduct(a, b) {
    return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

function cosineSimilarity(a, b) {
    const product = dotProduct(a, b); 
    const aMagnitude = Math.sqrt(a.map(value => value * value).reduce((a, b) => a + b, 0)); 
    const bMagnitude = Math.sqrt(b.map(value => value * value).reduce((a, b) => a + b, 0)); 
    return product / (aMagnitude * bMagnitude); 
}
console.log("Loading data...");

async function main() {
    console.log("Loading data...");
    const data = loadJSONData('data-with-embeddings2.json')
    // const input = 'animal'
    const input = "How old is John's mother."
    const inputEmbedding = await generateEmbeddings(input)           //.find(item => item.imput === input).embedding

    const similarities = []
    for (let i=0; i<data.length; i++) {
        // const similarity = cosineSimilarity(data[i].embedding, inputEmbedding.data[0].embedding)
        const similarity = dotProduct(data[i].embedding, inputEmbedding.data[0].embedding)
        similarities.push({input: data[i].imput, similarity: similarity})
    }

    console.log("Similarities of input: " + input)
    const sortSimilarities = similarities.sort((a, b) => b.similarity - a.similarity)
    sortSimilarities.forEach(similarity => {
       console.log(`${similarity.input}: ${similarity.similarity}`);
    })
}
// main()