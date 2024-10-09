export class ValidationError extends Error {
  constructor(msg: string, envName?: string) {
    const fullMsg = envName
      ? `${msg}, current value of '${envName}' is '${globalThis.process.env[envName]}'`
      : msg
    super(fullMsg)
  }
}
