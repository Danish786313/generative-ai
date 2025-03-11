import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 700,
    // verbose: true,
})

async function fromTemplate() {
    console.log("Generating response...")
    const prompt = ChatPromptTemplate.fromTemplate(
        'Write a short description for the following product: {product_name}'
    )

    const wholePromt = await prompt.format({
        product_name: 'shoes'
    })

    console.log("wholePromt", wholePromt)

    const chain = prompt.pipe(model)
    const response = await chain.invoke({
        product_name: 'shoes'
    })

    console.log(response.content)
}

async function FromMessage() {
    console.log("Generating response...")
    const prompt = ChatPromptTemplate.fromMessages([
        ['system', 'Write a short description for the product provided by the user'],
        ['human', '{product_name}'],
    ])

    const chain = prompt.pipe(model)
    const result = await chain.invoke({
        product_name: 'shoes'
    })

    console.log("Result", result.content)
}

// fromTemplate()
// FromMessage()