import {
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
  validateConfig,
} from '../src/'

export const appEnvs = validateConfig({
  PORT: getNumberFromEnvParser('PORT'),
  NODE_ENV: getStringEnumFromEnvParser('NODE_ENV', ['production', 'development', 'test'] as const),

  postgres: {
    HOST: getStringFromEnvParser('POSTGRES_HOST'),
    PASSWORD: getStringFromEnvParser('POSTGRES_PASSWORD'),
    PORT: 5432,
  },

  some: {
    nestedKey: getStringFromEnvParser('ADMIN_SERVICE_URL', { pattern: '(http|https)://*.' }),
  },
})
