import { existsSync, readFileSync } from 'fs'
import { ValidationError } from '../ValidationError'

export const getEnvFromFileParser = (envName: string, required = true) => () => {
  if (typeof window === 'object') {
    throw new Error("You cant import ... from 'typed-env-parser/node' in the browser")
  }

  const envValue = process.env[envName]?.trim()
  if (!envValue || envValue.length === 0 || !existsSync(envValue)) {
    if (!required) {
      return ''
    }
    throw new ValidationError(`There is no file path stored in ${envName}`, envName)
  }
  return readFileSync(envValue, 'utf-8').trim()
}
