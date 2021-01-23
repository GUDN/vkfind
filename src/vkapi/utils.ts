import { accessToken } from './auth'

export function makeUrl(methodName: string, options: string[][]): string {
  let result = new URL(`https://api.vk.com/method/${methodName}`)
  // @ts-ignore
  options.push(['v', process.env.VK_API_VERSION])
  options.push(['access_token', accessToken])
  result.search = new URLSearchParams(options).toString()
  return result.toString()
}
