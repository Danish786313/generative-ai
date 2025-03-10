import {ChromaClient, OpenAIEmbeddingFunction} from "chromadb";
import dotenv from "dotenv";
dotenv.config();

const client = new ChromaClient({
    path: "http://localhost:8000",
});
const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY? process.env.OPENAI_API_KEY : '',
    openai_model: 'text-embedding-3-small'
})
async function main() {
    const reponse = await client.createCollection({
        name: "my_collection2",
    });
    // await collection.add("hello world", "my text");
    console.log(reponse);
}

async function addData() {
    // const collection = await client.getCollection({name: "my_collection", embeddingFunction: embeddingFunction});

    // // const collection = await client.getCollection({
    // //     name: "my_collection"
    // // });
    // console.log('collectiondata', collection);
    // const result = await collection.add({
    //     ids: ['1', '2', '3'],
    //     documents: ['hello world', 'hello world 2', 'hello world 3'],
    //     embeddings: [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]]
    // });
    // console.log("result", result);


    try {
        
        const collection = await client.getCollection({
            name: 'my_collection2',
            embeddingFunction: embeddingFunction
        })
        console.log('collectiondata', collection);
        const result = await collection.add({
            ids: ["id1"],
            documents: ["Here is my entry"],
            embeddings: [[0.1, 0.2]]
          });

          const fetchResult = await collection.get({ ids: ["id1"] });
console.log('Fetched Data:', fetchResult);
        console.log('result', result)

    } catch (error) {
        console.log('error', error)        
    }
}

// addData();
// main()