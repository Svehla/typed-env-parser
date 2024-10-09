export const getProcessEnv = () => (typeof window === 'object' ? window.process.env : process.env)
