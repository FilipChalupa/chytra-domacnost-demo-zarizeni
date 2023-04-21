import { delay } from './utils/delay'

console.log('Starting')
const lightBaseUrl = 'http://10.10.241.189'

while (true) {
	try {
		const response = await fetch(
			'https://chytra-domacnost.onrender.com/api/physical',
		)
		const data = await response.json()
		await fetch(
			`${lightBaseUrl}/cm?cmnd=Power%20${data.light === 'on' ? 'On' : 'Off'}`,
		)
	} catch (error) {
		console.error(error)
		await delay(2000)
	}
	await delay(1000)
}
