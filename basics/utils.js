exports.deleteOlderMessage = (context, MAX_TOKENS) => {
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

exports.getContextLength = () => {
	
}