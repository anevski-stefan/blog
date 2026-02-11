export function logClientError(message: string, error?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(message, error)
  }
}
