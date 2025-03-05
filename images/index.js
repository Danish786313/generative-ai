import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
});

async function generateFreeImage() {
	console.log("Generating FreeImage...");
	const response = await openai.images.generate({
		prompt: 'A photo of a cat',
		model: 'dall-e-2',
		style: 'vivid',
		size: '256x256',
		quality: 'standard',
		n: 1
	});

	const timestamp = Date.now();
	fs.writeFileSync(`./images/responses/image-responses-${timestamp}.txt`, JSON.stringify(response));
	console.log("Image saved");
	console.log(response);
}

async function generateFreeLocalImage() {
	try {
		console.log("Generating FreeImage...");
		const response = await openai.images.generate({
			prompt: 'A photo of a cat',
			model: 'dall-e-2',
			style: 'vivid',
			size: '256x256',
			quality: 'standard',
			n: 1,
			response_format: 'b64_json',
		});

		const rawImage = response.data[0].b64_json
		if (rawImage) {
			const timestamp = Date.now();
			fs.writeFileSync(`./images/responses/cat-iamge-${timestamp}.png`, Buffer.from(rawImage, 'base64'))
		}
	} catch (err) {
		console.error("Error generating image", err);
	}
}

async function generateAdvancedImage() {
	console.log("Generating Advanced Image...");
    const response = await openai.images.generate({
        prompt: 'Photo of a city at night with skyscrapers',
        size: '256x256',
		model: 'dall-e-2',
		quality: 'hd',
        response_format: 'b64_json',
    });

    const rawImage = response.data[0].b64_json
    if (rawImage) {
        const timestamp = Date.now();
        fs.writeFileSync(`./images/responses/advance-images-${timestamp}.png`, Buffer.from(rawImage, 'base64'))
    }
}

async function generateImageVariation() {
	console.log("Generating Image Variation...");
    const response = await openai.images.createVariation({
        image: fs.createReadStream('./images/responses/advance-images-1741166474050.png'),
        n: 1,
        size: '256x256',
        model: 'dall-e-2',
		response_format: 'b64_json',
    });

	const rawImage = response.data[0].b64_json
    if (rawImage) {
        const timestamp = Date.now();
        fs.writeFileSync(`./images/responses/images-variation-${timestamp}.png`, Buffer.from(rawImage, 'base64'))
    }
}

async function editImage() {
	console.log("Editing Image...");
    const response = await openai.images.edit({
        image: fs.createReadStream('./images/responses/cat-iamge-1741166134570.png'),
		mask: fs.createReadStream('./images/responses/174116765680489123.png'),
        size: '256x256',
        model: 'dall-e-2',
        response_format: 'b64_json',
        prompt: 'Add a cityscape background to the image',
    });

    const rawImage = response.data[0].b64_json
    if (rawImage) {
        const timestamp = Date.now();
        fs.writeFileSync(`./images/responses/edited-image-${timestamp}.png`, Buffer.from(rawImage, 'base64'))
    }
}
// editImage()
// generateImageVariation()
// generateAdvancedImage()
// generateFreeLocalImage()
// generateFreeImage()