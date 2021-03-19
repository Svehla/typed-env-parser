import {
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
  getListFromEnvParser,
  validateConfig,
} from '../src/'

const customEnvs = {
  PORT: '3000',
  NODE_ENV: 'development',
  POSTGRES_HOST: 'localhost',
  POSTGRES_PASSWORD: 'Password1!',
  ADMIN_SERVICE_URL: 'https://example.com',

  ENV_NODE_ARR_STR_1: '["a", "b", "c"]',
  ENV_NODE_ARR_STR_2: '["d", "e", "f"]',
  ENV_NODE_ARR_STR_3: '["a", null, "b"]',
  ENV_NODE_ARR_FLOAT: '[1, 1.1, 1.11]',
  ENV_NODE_ARR_INT: '[{ "a": 1 }, 1, 1]',
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

  arrays: {
    arrStr1: getListFromEnvParser('ENV_NODE_ARR_STR_1'),
    arrStr2: getListFromEnvParser('ENV_NODE_ARR_STR_2', String),
    arrFloat: getListFromEnvParser('ENV_NODE_ARR_FLOAT', parseFloat),
    arrInt: getListFromEnvParser('ENV_NODE_ARR_INT', a => a),
  },
})

console.log(appEnvs)
