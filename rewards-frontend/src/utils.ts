const ENDPOINT = "http://localhost:3030/"

export const endpoint = (...segments: any[]): string => {
  return ENDPOINT + segments.filter(Boolean).join("/")
}
