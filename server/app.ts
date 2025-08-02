import cors from "cors";
import express from 'express';
import path from 'node:path';
import supertokens from 'supertokens-node';

import { errorHandler, middleware } from 'supertokens-node/framework/express';

import { config } from './config';
import { superConfig } from './supertokens';
import { endsWith } from 'lodash-es';
import { createProxyMiddleware } from 'http-proxy-middleware';

supertokens.init(superConfig);

const angularDir = path.join(__dirname, '../angular/browser');

const app = express();

// proxy requests
const proxyMiddleware = createProxyMiddleware({
  target: config.spring.uri,
  changeOrigin: true
});
app.use('/api', proxyMiddleware)

app.use(express.json());
app.use(
  cors({
    origin: config.cors.origin,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true
  })
);

// use supertokens middleware
app.use(middleware());

// serve angular files
app.use('/', express.static(angularDir, {
  index: 'index.html',
  setHeaders: (res, filePath) => {
    if (endsWith(filePath, 'index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// health of the app
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK'});
});

// return angular index.html for all other routes
app.get('*all', (req, res) => {
  res.set({ 'Cache-Control': 'no-store' })
  res.sendFile(path.join(angularDir, 'index.html'));
});

// default return 404
app.all('*all', (req, res) => {
  res.status(404).json({
    error: "Not Found"
  });
});

// supertokens error handler
app.use(errorHandler());
// my error handler
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    error: "Internal Server Error"
  });
});

export default app;
