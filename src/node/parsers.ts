import { getProcessEnv } from '../envInput'
import { ValidationError } from '../ValidationError'
import { existsSync, readFileSync } from 'fs'

export const getEnvFromFileParser =
  (envName: string, required = true) =>
  () => {
    const envValue = getProcessEnv()[envName]?.trim()
    if (!envValue || envValue.length === 0 || !existsSync(envValue)) {
      if (!required) {
        return ''
      }
      throw new ValidationError(`There is no file path stored in ${envName}`, envName)
    }
    return readFileSync(envValue, 'utf-8').trim()
  }
