import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
