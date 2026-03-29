import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import prisma from '../lib/prisma.js';
import type { Request, Response } from 'express';
import { handleControllerError } from '../lib/http.js';

export const registerController = async (req: Request, res: Response) => {
	try {
		const data = registerSchema.parse(req.body);

		const existingUser = await prisma.user.findUnique({
			where: { email: data.email }
		});

		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const passwordHash = await bcrypt.hash(data.password, 10);

		const user = await prisma.user.create({
			data: {
				email: data.email,
				fullName: data.fullName,
				birthDate: data.birthDate,
				passwordHash,
				role: data.role ?? 'user'
			},
			select: {
				id: true,
				email: true,
				fullName: true,
				birthDate: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return res.status(201).json(user);
	} catch (error) {
		return handleControllerError(error, res);
	}
};

export const loginController = async (req: Request, res: Response) => {
	try {
		const data = loginSchema.parse(req.body);

		const user = await prisma.user.findUnique({
			where: { email: data.email }
		});

		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		if (!user.isActive) {
			return res.status(403).json({ message: 'User is not active' });
		}

		const isPasswordValid = await bcrypt.compare(
			data.password,
			user.passwordHash
		);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			return res.status(500).json({ message: 'JWT secret not configured' });
		}

		const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
			expiresIn: '1h'
		});

		return res.status(200).json({ token });
	} catch (error) {
		return handleControllerError(error, res);
	}
};
