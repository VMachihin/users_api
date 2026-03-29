import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getCurrentUserController = (req: Request, res: Response) => {
	return res.json({
		user: req.user
	});
};

export const getUsersController = async (req: Request, res: Response) => {
	try {
		const currentUser = req.user;

		if (!currentUser) {
			return res.status(401).json({
				message: 'Unauthorized'
			});
		}

		if (currentUser.role !== 'admin') {
			return res.status(403).json({
				message: 'Forbidden'
			});
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				fullName: true,
				birthDate: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true
			},
			orderBy: {
				id: 'asc'
			}
		});

		return res.json(users);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: 'Internal server error'
		});
	}
};

export const getUserByIdController = async (req: Request, res: Response) => {
	try {
		const currentUser = req.user;
		const requestedUserId = Number(req.params.id);

		if (!currentUser) {
			return res.status(401).json({
				message: 'Unauthorized'
			});
		}

		if (Number.isNaN(requestedUserId)) {
			return res.status(400).json({
				message: 'Invalid user id'
			});
		}

		const canAccess =
			currentUser.role === 'admin' || currentUser.userId === requestedUserId;

		if (!canAccess) {
			return res.status(403).json({
				message: 'Forbidden'
			});
		}

		const user = await prisma.user.findUnique({
			where: { id: requestedUserId },
			select: {
				id: true,
				fullName: true,
				birthDate: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!user) {
			return res.status(404).json({
				message: 'User not found'
			});
		}

		return res.json(user);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: 'Internal server error'
		});
	}
};

export const blockUserController = async (req: Request, res: Response) => {
	try {
		const currentUser = req.user;
		const targetUserId = Number(req.params.id);

		if (!currentUser) {
			return res.status(401).json({
				message: 'Unauthorized'
			});
		}

		if (Number.isNaN(targetUserId)) {
			return res.status(400).json({
				message: 'Invalid user id'
			});
		}

		const canBlock =
			currentUser.role === 'admin' || currentUser.userId === targetUserId;

		if (!canBlock) {
			return res.status(403).json({
				message: 'Forbidden'
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: { id: targetUserId }
		});

		if (!existingUser) {
			return res.status(404).json({
				message: 'User not found'
			});
		}

		const blockedUser = await prisma.user.update({
			where: { id: targetUserId },
			data: {
				isActive: false
			},
			select: {
				id: true,
				fullName: true,
				birthDate: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return res.json({
			message: 'User has been blocked',
			user: blockedUser
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: 'Internal server error'
		});
	}
};
