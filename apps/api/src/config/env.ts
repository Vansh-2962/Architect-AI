import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const betterAuthSecret = requireEnv('BETTER_AUTH_SECRET');
if (betterAuthSecret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long');
}

export const env = {
  port,
  databaseUrl: requireEnv('DATABASE_URL'),
  betterAuthSecret,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  betterAuthUrl: requireEnv('BETTER_AUTH_URL'),
  webOrigin: requireEnv('WEB_ORIGIN'),
  groqApiKey: process.env.GROQ_API_KEY?.trim(),
};
