const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const router = require('./DataBase/router');

dotenv.config();

const app = express();
app.use(cors({ exposedHeaders: ['X-Request-ID'] }));

app.use((req, res, next) => {
  const incomingId = req.get('x-request-id');
  req.requestId = incomingId && /^[a-zA-Z0-9._-]{1,80}$/.test(incomingId)
    ? incomingId
    : crypto.randomUUID();
  const startedAt = process.hrtime.bigint();
  res.setHeader('X-Request-ID', req.requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger.write(level, 'http.request.completed', {
      requestId: req.requestId,
      method: req.method,
      route: req.route ? `${req.baseUrl}${req.route.path}` : (req.path === '/' ? '/' : 'unmatched'),
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });
  res.on('close', () => {
    if (!res.writableEnded) {
      logger.write('warn', 'http.request.aborted', {
        requestId: req.requestId,
        method: req.method,
        route: req.route ? `${req.baseUrl}${req.route.path}` : 'unmatched',
      });
    }
  });
  next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => res.status(200).json({ service: 'frienemie-api', status: 'ok' }));
app.use('/route', router);
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((error, req, res, _next) => {
  const statusCode = Number(error.status) >= 400 && Number(error.status) < 600 ? Number(error.status) : 500;
  logger.write('error', 'http.request.failed', {
    requestId: req.requestId,
    method: req.method,
    route: req.route ? `${req.baseUrl}${req.route.path}` : 'unmatched',
    statusCode,
    ...logger.errorDetails(error),
  });
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error.' : error.message,
    requestId: req.requestId,
  });
});

async function start() {
  try {
    await mongoose.connect(process.env.Url);
    logger.write('info', 'database.connected');
    const port = process.env.Port || 2024;
    app.listen(port, () => logger.write('info', 'server.started', { port: Number(port) || port }));
  } catch (error) {
    logger.write('error', 'database.connection.failed', logger.errorDetails(error));
    process.exitCode = 1;
  }
}

mongoose.connection.on('disconnected', () => logger.write('warn', 'database.disconnected'));
mongoose.connection.on('reconnected', () => logger.write('info', 'database.reconnected'));

process.on('unhandledRejection', (error) => {
  logger.write('error', 'process.unhandled_rejection', logger.errorDetails(error));
});

start();