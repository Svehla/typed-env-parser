export { getEnvFromFileParser } from './nodeConfigEnvParsers'

if (typeof window === 'object') {
  throw new Error(`You cant import ... from 'typed-env-parser/node' in the browser`)
}
