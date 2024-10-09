import { processEnv } from './envInput'

export class ValidationError extends Error {
  constructor(msg: string, envName?: string) {
    const fullMsg = envName
      ? `${msg}, current value of '${envName}' is '${processEnv[envName]}'`
      : msg
    super(fullMsg)
  }
}
