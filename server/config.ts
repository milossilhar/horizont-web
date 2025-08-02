export interface Config {
  port: number;
  nodeEnv: string;
  hostname: string;
  supertokens: {
    uri: string
  },
  spring: {
    uri: string
  },
  cors: {
    origin: string;
  }
}

export const config: Config = {
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  hostname: process.env['APP_HOSTNAME'] || 'http://localhost:4200',
  supertokens: {
    uri: process.env['APP_SUPERTOKENS_CORE_URI'] || 'http://localhost:3567',
  },
  spring: {
    uri: process.env['APP_SPRING_URI'] || 'http://localhost:8080/api'
  },
  cors: {
    origin: process.env['APP_CORS_ORIGIN'] || 'http://localhost:4200'
  }
};