import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
});

function getTimeOfDay() {
	return "05:45";
}

function getOrderStatus(orderId) {
	console.log("Getting the status of order " + orderId)
	const orderAsNumber = parseInt(orderId, 10);
	if (orderAsNumber % 2 == 0) {
		return "Order is in progress";
	}
	return "Order is completed";

}

async function callOpenAIWithTools() {
	const context = [
		{
			role: "system",
			content: "You are a helpful assistant that gives information about the time of day and order status",
		},
		{
			role: "user",
			//   content: "what is the time of day?",
			content: "what is the status of order 1234?",
		},
	];

	// First OpenAI call
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: context,
		tools: [
			{
				name: "getTimeOfDay",
				description: "Get the time of day",
				type: "function",
				function: {
					name: "getTimeOfDay",
					description: "Get the time of day",
				},
			},
			{
				type: "function",
				function: {
					name: "getOrderStatus",
                    description: "Get the status of an order",
                    parameters: {
						type: "object",
                        properties: {
							orderId: {
								type: "string",
                                description: "The ID of the order to get the status of ",
							}
						},
						required: ["orderId"],
                        // orderId: {
                        //     type: "string",
                        //     description: "The order ID",
                        // },
                    },
				}
			}
		],
		tool_choice: "auto", // Engine decides whether to use the tool
	});

	console.log("Tool Selection response:", response.choices[0].message.content);

	const timestamp = Date.now();
	fs.writeFileSync(
		`./tools/responses/tools-${timestamp}.txt`,
		"FIRST RESPONSE: " + (response.choices[0].message.content || "something went wrong.")
	);

	// Check if the assistant wants to invoke a tool
	const willInvokeFunction = response.choices[0].finish_reason === "tool_calls";
	const toolCall = willInvokeFunction ? response.choices[0].message.tool_calls?.[0] : null;

	if (willInvokeFunction && toolCall) {
		// Ensure context includes the assistant's tool call message
		context.push({
			role: "assistant",
			tool_calls: response.choices[0].message.tool_calls,
		});

		const toolName = toolCall.function.name;

		if (toolName === "getTimeOfDay") {
			const toolResponse = getTimeOfDay();
			console.log("Time of Day:", toolResponse);

			// Add the tool response to context
			context.push({
				role: "tool",
				content: toolResponse,
				tool_call_id: toolCall.id,
			});

			fs.writeFileSync(`./tools/responses/timeOfDay-${timestamp}.txt`, 'getTimeOfDay : '+ toolResponse);
		}

		if (toolName === "getOrderStatus") {
			const rawArgument = toolCall.function.arguments;
			const parseArguments = JSON.parse(rawArgument)
			const toolResponse = getOrderStatus(parseArguments.orderId);
			console.log("Order status:", toolResponse);

			// Add the tool response to context
			context.push({
				role: "tool",
				content: toolResponse,
				tool_call_id: toolCall.id,
			});

			fs.writeFileSync(`./tools/responses/timeOfDay-${timestamp}.txt`, toolResponse);
		}
	}

	// Second OpenAI call with updated context
	const secondResponse = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: context,
	});

	console.log("Second OpenAI response:", secondResponse.choices[0].message.content);
	fs.writeFileSync(
		`./tools/responses/second-response-${timestamp}.txt`,
		"SECOND RESPONSE: " + (secondResponse.choices[0].message.content || "something went wrong.")
	);
}

// callOpenAIWithTools();