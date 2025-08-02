/**
 * This file is replaced with environment variables when building for production using envsub.
 * Look in package.json scripts for more info.
 */
export const environment = {
  api: {
    url: '${APP_BACKEND_API_URI:-/api}'
  },
  supertokens: {
    domain: '${APP_HOSTNAME:-http://localhost:3000}'
  },
  website: {
    domain: '${APP_HOSTNAME:-http://localhost:3000}'
  }
};
