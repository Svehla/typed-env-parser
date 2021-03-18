import {
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
  validateConfig,
} from '../src/'

const customEnvs = {
  PORT: '3000',
  NODE_ENV: 'development',
  POSTGRES_HOST: 'localhost',
  POSTGRES_PASSWORD: 'Password1!',
  ADMIN_SERVICE_URL: 'https://example.com',
}

Object.entries(customEnvs).forEach(([key, oldValue]) => {
  process.env[key] = oldValue
})

export const appEnvs = validateConfig({
  PORT: getNumberFromEnvParser('PORT'),
  NODE_ENV: getStringEnumFromEnvParser('NODE_ENV', ['production', 'development', 'test'] as const),

  postgres: {
    HOST: getStringFromEnvParser('POSTGRES_HOST'),
    PASSWORD: getStringFromEnvParser('POSTGRES_PASSWORD'),
    PORT: 5432 as const,
  },

  a: [1, 2, 3],
  some: {
    nestedKey: getStringFromEnvParser('ADMIN_SERVICE_URL', { pattern: '(http|https)://*.' }),
  },
})

console.log(appEnvs)
