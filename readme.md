# Stable env parser

## Example usage

```bash
npm i stable-env-parser
```

```typescript
import {
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
  validateConfig,
} from './libs/config/configEnvParsers'

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
```

![Typescript preview](./example/static/ts-preview-1.png)

## Why to use this env parser

## Requirements

Typescript >= 4.1.5

### Inferred static types

### Batched runtime validator errors

### Extensible API

### No default values
