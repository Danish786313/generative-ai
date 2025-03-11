import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 700,
    // verbose: true,
})

async function main() {
    // const response = await llm.call('Hello, how are you?')
    // console.log(response)
    // const response = await model.invoke('Give me 4 books names to read.')
    // const response2 = await model.batch([
    //     "Hello",
    //     "Give me 4 books names to read."
    // ])
    // console.log(response2)
    const response3 = await model.stream('Give me 4 books names to read.')
    for await (const chunk of response3) {
        // console.log(chunk.response_metadata)
        console.log(chunk.content)
        // console.log(chunk)
    }
}

// main()