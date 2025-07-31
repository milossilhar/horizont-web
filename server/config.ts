export interface Config {
  port: number;
  nodeEnv: string;
  hostname: string;
  coreURI: string;
  cors: {
    origin: string;
  }
}

export const config: Config = {
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  hostname: process.env['APP_HOSTNAME'] || 'http://localhost:4200',
  coreURI: process.env['APP_SUPERTOKENS_CORE_URI'] || 'http://localhost:3567',
  cors: {
    origin: process.env['APP_CORS_ORIGIN'] || 'http://localhost:4200'
  }
};