export {};

declare global {
	namespace Express {
		export interface Request {
			user?: {
				userId: number;
				role: string;
			};
		}
	}
}
