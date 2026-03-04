import express from 'express';
import v1Routes from './routes/v1/index.js';
import { errorHandler } from './middleware/errorHandlerMiddleware.js';

const app = express();

app.use(express.json());
app.use('/api/users', v1Routes);
app.use(errorHandler);
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
