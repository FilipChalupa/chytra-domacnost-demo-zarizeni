import { delay } from './utils/delay.ts'

console.log('Starting')

const rgbLights = [
	{
		linked: false,
		mac: 'EC:C7:10:29:B1:22',
	},
	{
		linked: false,
		mac: 'C2:BF:C7:30:AA:F3',
	},
]

console.log('Discovering RGB lights')
while (true) {
	try {
		const response = await fetch(
			'http://localhost:8080/NeewerLite-Python/doAction?discover',
		)
		if (response.ok) {
			const response = await fetch(
				'http://localhost:8080/NeewerLite-Python/doAction?list',
			)
			const text = await response.text()
			for (const rgbLight of rgbLights) {
				if (text.includes(rgbLight.mac)) {
					rgbLight.linked = true
				}
			}
		}
	} catch (error) {
		console.error(error)
	}

	const notLinkedRgbLights = rgbLights.filter((rgbLight) => !rgbLight.linked)

	if (notLinkedRgbLights.length === 0) {
		console.log('RGB lights are linked')
		break
	} else {
		notLinkedRgbLights.forEach((rgbLight) => {
			console.log(`RGB light ${rgbLight.mac} is not linked yet`)
		})
	}

	await delay(1000)
	console.log('Retrying')
}
