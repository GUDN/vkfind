export function any<T>(array: T[], predicant: (arg: T) => boolean) {
  for (const item of array) {
    if (predicant(item)) {
      return true
    }
  }
  return false
}
