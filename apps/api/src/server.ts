import cors from 'cors';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import designsRouter from './routes/designs.js';

const app = express();

app.use(cors({
  origin: env.webOrigin,
  credentials: true,
}));

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/designs', designsRouter);

const server = app.listen(env.port, () => {
  console.info(`System Designer API listening on http://localhost:${env.port}`);
});

async function shutdown() {
  server.close(async (error) => {
    if (error) {
      console.error('Failed to close HTTP server cleanly:', error);
      process.exitCode = 1;
    }
    await prisma.$disconnect();
  });
}

process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
