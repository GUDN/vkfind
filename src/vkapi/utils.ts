import { accessToken } from './auth'
import moment from 'moment'

const now = moment()

export function makeUrl(methodName: string, options: string[][]): string {
  let result = new URL(`https://api.vk.com/method/${methodName}`)
  // @ts-ignore
  options.push(['v', process.env.VK_API_VERSION])
  options.push(['access_token', accessToken])
  result.search = new URLSearchParams(options).toString()
  return result.toString()
}

export function bdate2age(bdate: string): number {
  let m: moment.Moment
  try {
    m = moment(bdate, 'D.M.YYYY')
  } catch (e) {
    return -1
  }
  const result = moment.duration(now.diff(m)).years()
  return result == 0 ? -1 : result
}
