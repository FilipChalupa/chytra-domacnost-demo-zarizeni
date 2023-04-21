import { colorHexToRgb } from './utils/colorHexToRgb'
import { delay } from './utils/delay'

console.log('Starting')
const lightBaseUrl = 'http://192.168.1.254'

const size = 10
const flip = (items) => {
	const newItems = items.map((_, i) => {
		const x = i % size
		const y = Math.floor(i / size)
		return items[size - x - 1 + y * size]
	})
	return newItems
}

const mirror = (items) => {
	const newItems = items.map(
		(_, i) => items[Math.floor(i / size) * size + 9 - (i % size)],
	)
	return newItems
}

const rotateCounterClockwise = (items) => {
	const newItems = items.map((_, i) => {
		const x = i % size
		const y = Math.floor(i / size)
		return items[y + (size - x - 1) * size]
	})
	return newItems
}

while (true) {
	try {
		console.log('Looping')
		const response = await fetch(
			'https://chytra-domacnost.onrender.com/api/physical',
		)
		const data = await response.json()
		console.log('Updating light')
		await fetch(
			`${lightBaseUrl}/cm?cmnd=Power%20${data.light === 'on' ? 'On' : 'Off'}`,
		)
		console.log('Updating colors')
		await fetch('http://192.168.1.14/json', {
			method: 'POST',
			body: JSON.stringify({
				seg: {
					i: mirror(
						rotateCounterClockwise(
							data.matrix.map((color) => colorHexToRgb(color)),
						),
					),
				},
			}),
		})
	} catch (error) {
		console.error(error)
		await delay(2000)
	}
	await delay(1000)
}
