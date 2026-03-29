import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type AuthJwtPayload = {
	userId: number;
	role: 'admin' | 'user';
};

function isAuthJwtPayload(value: unknown): value is AuthJwtPayload {
	return (
		typeof value === 'object' &&
		value !== null &&
		'userId' in value &&
		'role' in value &&
		typeof value.userId === 'number' &&
		(value.role === 'admin' || value.role === 'user')
	);
}

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}

	const secret = process.env.JWT_SECRET;
	const parts = authHeader.split(' ');
	const token = parts[1];

	if (!secret) {
		throw new Error('JWT_SECRET is not set');
	}

	if (!token) {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}

	try {
		const decoded: unknown = jwt.verify(token, secret);

		if (!isAuthJwtPayload(decoded)) {
			return res.status(401).json({
				message: 'Invalid token payload'
			});
		}

		req.user = {
			userId: Number(decoded.userId),
			role: decoded.role === 'admin' ? 'admin' : 'user'
		};

		next();
	} catch {
		return res.status(401).json({
			message: 'Invalid token'
		});
	}
}
