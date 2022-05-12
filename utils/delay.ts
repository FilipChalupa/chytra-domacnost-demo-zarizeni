export const delay = (milliseconds: number): Promise<undefined> =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve(undefined)
		}, milliseconds),
	)
