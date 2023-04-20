require('dotenv').config();
import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

const app = express();

app.use([morgan('dev'), express.json(), helmet(), cors()]);

app.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API is running...',
  });
});

app.use('/api/v1', api);

export default app;
