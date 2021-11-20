// Type definitions for errio

declare module 'errio' {
	let toObject: (
		error: Error,
		options: {
			stack: boolean;
		},
	) => object;
}
