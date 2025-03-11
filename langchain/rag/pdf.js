// Basics

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 700,
    // verbose: true,
})

const mydata = [
    'My name is john.',
    'My name is Bob.',
    'My favorite food is pizaa.',
    'My favorite food is pasta.'
]

const question = 'What themes does Gone with the Wind explore?'

async function main() {
    console.log("Generating response...")
    
    const loader = new PDFLoader('./langchain/rag/books.pdf', {
         splitPages: false
    })
    const docs = await loader.load()

    const splitter = new RecursiveCharacterTextSplitter({
        separators: ['. \n']
    })

    const splittedDocs = await splitter.splitDocuments(docs)
    // const vectorStore = await MemoryVectorStore.fromDocuments(docs)

    //store the data
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({
        model: 'text-embedding-3-small'
    }))
    // await vectorStore.addDocuments(mydata.map(
    //     content => new Document({ pageContent: content })
    // ))
    await vectorStore.addDocuments(splittedDocs)

    // create data retriever
    const retriever = vectorStore.asRetriever({
        k: 2
    })

    // get relevant document
    const results = await retriever._getRelevantDocuments(question)
    const resultDocs = results.map(doc => doc.pageContent);

    // build template
    const template = ChatPromptTemplate.fromPromptMessages([
        { role: 'system', content: 'Answer the following question based on the following context: {context}.' },
        { role: 'user', content: '{input}' },
    ])

    const chain = template.pipe(model)

    const response = await chain.invoke({ 
        input: question, 
        context: resultDocs.join('\n') 
    })
    console.log(response.content)
}

// main()