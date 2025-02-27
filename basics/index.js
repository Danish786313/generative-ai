import { OpenAI } from 'openai'
import  fs from 'fs'
import { encoding_for_model } from 'tiktoken'
const encoder = encoding_for_model('gpt-4o-mini')
const MAX_TOKENS = 7

const opneai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
})

async function main() {
	const response = await opneai.chat.completions.create({
		model: 'gpt-4o-mini',
        // temperature: 0.7,
        max_tokens: 100,
		// temperature: 0.7,
        // logprobs: 0,
        // nucleus: 0.95,
        // stream: false,
        // best_of: 1,
        // stop: ['\n'],
        // n: 1, // number of results  response.choices[n]
        // presence_penalty: 0, // number of 
        // frequency_penalty: 0,
        messages: [
			// {
			// 	role: 'assistant',
            //     content: 'Welcome to the Marketing Plan Generator! Please provide me with some information about your product.',
            // },
			{
				role: 'system',
				content: `You response like a cool bro, and you response in JSON format like this: 
				        coolnessLevel: 1-10
				        answer: your answer`
			},
            {
                role: 'user',
                content: 'I need help creating a marketing plan for my new product.',
            },
        ],
	})
	console.log(response.choices[0].message.content)
	const timestamp = new Date().getTime()
	fs.writeFileSync(`./responses/marketing_plan-${timestamp}.txt`, response.choices[0].message.content || 'something went wrong.')
	console.log('Marketing plan saved to marketing_plan.txt')
}
// main()

const context = [{
	role: 'user',
    content: 'You are a helpful chatbot',
}]

async function createChatCompletion() {
	const response = await opneai.chat.completions.create({
		model: 'gpt-4o-mini',
        max_tokens: 100,
        messages: context
		// messages: [
        //     {
        //         role:'system',
        //         content: `You are a helpful chatbot`
        //     },
        //     {
        //         role: 'user',
        //         content: inputString,
        //     },
        // ],
    })
	const responseMessage = response.choices[0].message
	context.push({
		role: 'assistant',
        content: responseMessage.content || '',
	})

    if (response.usage && response.usage.total_tokens > MAX_TOKENS) {
        deleteOlderMessage()
    }


	console.log(`${response.choices[0].message.role}: ${response.choices[0].message.content}`)
}
process.stdin.addListener('data', async function (input) {
	const inputString = input.toString().trim();
	context.push({
		role: 'user',
        content: inputString,
	})
	await createChatCompletion()
})


function deleteOlderMessage() {
    let contextLength = getContextLength()
    while (contextLength > MAX_TOKENS) {
        for (let i=0; i< context.length; i++) {
            const message = context[i]
            if (message.role != 'system') {
                context.splice(i, 1)
                contextLength = getContextLength()
                console.log('New context length' + contextLength)
                break;
            }
        }
    }
}

function getContextLength() {
    let length = 0
    context.forEach(message => {
        if (typeof message.content === 'string') {
            length += encoder.encode(message.content).length
        } else if (Array.isArray(message.content)) {
            message.content.forEach(messageContent => {
                if (messageContent.type === 'text') {
                    length += encoder.encode(messageContent.content).length
                }
            });
        }
    })
    return length
}
