import type { Response } from 'express';
import { ZodError } from 'zod';

export function handleControllerError(error: unknown, res: Response) {
	if (error instanceof ZodError) {
		return res.status(400).json({
			message: 'Validation failed',
			errors: error.issues
		});
	}

	console.error(error);

	return res.status(500).json({
		message: 'Internal server error'
	});
}
