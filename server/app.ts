import cors from "cors";
import express from 'express';
import path from 'node:path';
import supertokens from 'supertokens-node';

import { errorHandler, middleware } from 'supertokens-node/framework/express';

import { config } from './config';
import { superConfig } from './supertokens';

const app = express();
const angularDir = path.join(__dirname, '../angular/browser');

supertokens.init(superConfig);

app.use(express.json());
app.use(
  cors({
    origin: config.cors.origin,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true
  })
);

app.use(middleware());

// serve angular static files
app.use(express.static(angularDir));

// health of the app
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK'});
});

// return angular index.html for all other routes
app.get('*all', (req, res) => {
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
