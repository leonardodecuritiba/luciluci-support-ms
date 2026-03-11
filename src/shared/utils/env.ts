import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: readEnv('NODE_ENV', 'development'),
  serverPort: Number(readEnv('SERVER_PORT', '3000')),
  db: {
    host: readEnv('DB_HOST', 'localhost'),
    port: Number(readEnv('DB_PORT', '5432')),
    username: readEnv('DB_USER', 'postgres'),
    password: readEnv('DB_PASSWORD', 'postgres'),
    database: readEnv('DB_NAME', 'standard_ms'),
  },
  rabbitmq: {
    host: readEnv('RABBITMQ_HOST', 'localhost'),
    port: Number(readEnv('RABBITMQ_PORT', '5672')),
    username: readEnv('RABBITMQ_USERNAME', 'guest'),
    password: readEnv('RABBITMQ_PASSWORD', 'guest'),
    vhost: readEnv('RABBITMQ_VHOST', '/'),
    profileExchange: readEnv('RABBITMQ_PROFILE_EXCHANGE', 'profile.events'),
    classificationExchange: readEnv(
      'RABBITMQ_CLASSIFICATION_EXCHANGE',
      'classification.events',
    ),
    connectionTimeout: Number(readEnv('RABBITMQ_CONNECTION_TIMEOUT', '30000')),
    heartbeat: Number(readEnv('RABBITMQ_HEARTBEAT', '60')),
  },
  outbox: {
    pollIntervalMs: Number(readEnv('OUTBOX_POLL_INTERVAL_MS', '2000')),
    batchSize: Number(readEnv('OUTBOX_BATCH_SIZE', '20')),
  },
  consumer: {
    prefetch: Number(readEnv('CONSUMER_PREFETCH', '10')),
  },
};

export function isTestEnvironment(): boolean {
  return env.nodeEnv === 'test';
}
