// Based on https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
export const colorHexToHsl = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (result === null) {
		throw new Error(`${hex} is not hex color`)
	}
	let r = parseInt(result[1], 16)
	let g = parseInt(result[2], 16)
	let b = parseInt(result[3], 16)
	;(r /= 255), (g /= 255), (b /= 255)
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	const l = (max + min) / 2
	let h = 0,
		s = 0
	if (max == min) {
		h = s = 0 // achromatic
	} else {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	}
}
