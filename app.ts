import { delay } from './utils/delay.ts'

console.log('Starting')

while (true) {
	console.log('Discovering devices')
	try {
		const response = await fetch(
			'http://localhost:8080/NeewerLite-Python/doAction?discover',
		)
		console.log(response.ok)
		if (response.ok) {
			const text = await response.text()
			console.log(text)
		}
	} catch (error) {
		console.error(error)
	}
	await delay(1000)
}
