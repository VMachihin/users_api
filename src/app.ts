import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app;
