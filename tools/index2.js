// configlire chat tools (first openAI call)
// decide if tool call is required
// invoke the tool
// make a second openAI call with the tool response

import OpenAI from "openai";
import  fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

function getTimeOfDay() {
  return '05:45'
}
async function callOpenAIWithTools() {
  // First OpenAI call: Tool Selection
  // const response = await openai.Completion.create({
  //   engine: "text-davinci-003",
  //   prompt: "Which of the following tools would you recommend for creating a marketing plan for my new product?",
  //   maxTokens: 100,
  //   temperature: 0.7,
  //   n: 1,
  //   stop: ["\n", "###"],
  // });
  const context = [
    {
      role: "system",
      content: "You are a helpful assistant that gives information about the time of day",
    },
    {
      role: "user",
      content: "what is the time of day?",
    }
  ]

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    // max_tokens: 100,
    // temperature: 0.7,
    messages: context,
    tools: [{
      name: 'getTimeOfDay',
      description: 'Get the time of day',
      type: 'function',
      "function": {
        "name": "getTimeOfDay",
        "description": "Get the time of day",
        // "parameters": {
          // "type": "object",
          // "properties": {
          //   "location": {
          //     "type": "string",
          //     "description": "The city and state, e.g., San Francisco, CA"
          //   },
          //   "unit": {
          //     "type": "string",
          //     "enum": ["Celsius", "Fahrenheit"],
          //     "description": "The temperature unit to use. Infer this from the user's location."
          //   }
          // },
          // "required": ["location", "unit"]
        // }
      }
    }],
    tool_choice: 'auto',// the engne will decide which tool to use
    // n: 1,
    // stop: ["\n", "###"],
  })
  console.log("Tool Selection response:", response.choices[0].message.content);
  const timestamp = new Date().getTime()
  fs.writeFileSync(`./tools/responses/tools-${timestamp}.txt`, 'FIRST RESPONSE:' + response.choices[0].message.content || 'something went wrong.')

  // decide is tool call is required
  const willInvodeFunction = response.choices[0].finish_reason = 'tool_calls'
  console.log("WillInvode", response.choices[0].message.tool_calls[0], "willInvodeFunction", willInvodeFunction)
  const toolCall = response.choices[0].message.tool_calls[0]

  if (willInvodeFunction) {
    const toolName = toolCall.function.name 

    if (toolName == 'getTimeOfDay') {
      const toolResponse = getTimeOfDay()
      console.log("Time of Day:", toolResponse)
      context.push({
        role: 'tool',
        content: toolResponse,
        tool_call_id: toolCall.id,
      })
      fs.writeFileSync(`./tools/responses/timeOfDay-${timestamp}.txt`, toolResponse)
    }
  }

  const secondResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context
  })
  console.log("Second OpenAI response:", secondResponse.choices[0].message.content);
  fs.writeFileSync(`./tools/responses/second-response-${timestamp}.txt`, 'SECOND RESPONSE:' + secondResponse.choices[0].message.content || 'something went wrong.')


}
callOpenAIWithTools()