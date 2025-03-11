import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser} from 'langchain/output_parsers'

const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 700,
    // verbose: true,
})

async function stringParser() {
    console.log("Generating response...")
    const prompt = ChatPromptTemplate.fromTemplate(
        'Write a short description for the following product: {product_name}'
    )

    const parser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(parser)
    const response = await chain.invoke({
        product_name: 'shoes'
    })

    console.log(response)
}


async function CommaSeparatedListOutput() {
    console.log("Generating response...")
    const prompt = ChatPromptTemplate.fromTemplate(
        'Provide the first 5 ingredients, seprated by commas, for: {word}'
    )

    const parser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(parser)
    const response = await chain.invoke({
        word: 'Biryani'
    })

    console.log(response)
}

async function structuredParser() {
    console.log("Generating response...")
    const templatePrompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting instructions: {format_instructions}
        Phrase: {phrase}
    `)

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: 'the name of the person',
        likes: 'What the person likes'
    }) 

    const chain = templatePrompt.pipe(model).pipe(outputParser)

    const result = await chain.invoke({
        phrase: 'John likes to watch movies',
        format_instructions: outputParser.getFormatInstructions(),
    })

    console.log(result)
}

// stringParser()
// CommaSeparatedListOutput()
// structuredParser()