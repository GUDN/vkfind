import { basePersons } from '../stores/searchOptions'
interface AccessTokenEntry {
  accessToken: string
  expiresAt: number
  userId: number
}

export let accessToken: string = ''
export let userId: number = -1

function checkLocalStorage(): AccessTokenEntry {
  const entry = localStorage.getItem('accessToken')
  if (entry == null) return null
  const token: AccessTokenEntry = JSON.parse(entry)
  if (token.expiresAt == 0 || token.expiresAt > Date.now()) return token
  return null
}

function requestAccessToken() {
  const loc = document.location
  const redirectUri = `${loc.protocol}//${loc.host}${loc.pathname}`
  document.location.replace(
    // @ts-ignore
    `https://oauth.vk.com/authorize?client_id=${process.env.VK_APP_ID}&display=page&redirect_uri=${redirectUri}&response_type=token&v=${process.env.VK_API_VERSION}`
  )
}

function clearHashAndReload() {
  document.location.hash = ''
  document.location.reload()
}

function parseVkReply() {
  const hash = document.location.hash.slice(1)
  let result: AccessTokenEntry = {
    accessToken: '',
    expiresAt: 1,
    userId: -1,
  }

  for (let entry of hash.split('&')) {
    const pair = entry.split('=')
    if (pair.length != 2) clearHashAndReload()

    switch (pair[0]) {
      case 'error':
        requestAccessToken()
        break
      case 'access_token':
        result.accessToken = pair[1]
        break
      case 'expires_in':
        let expiresIn = parseInt(pair[1])
        if (expiresIn == 0) result.expiresAt = 0
        else result.expiresAt = Date.now() + expiresIn - 100
        break
      case 'user_id':
        result.userId = parseInt(pair[1])
        break
      default:
        clearHashAndReload()
        break
    }
  }

  document.location.hash = ''
  localStorage.setItem('accessToken', JSON.stringify(result))
}

export function login() {
  if (document.location.hash.length > 0) {
    parseVkReply()
  }
  const token = checkLocalStorage()
  if (token == null) requestAccessToken()
  accessToken = token.accessToken
  userId = token.userId
  basePersons.addEmpty()
  basePersons.update(0, userId.toString())
}
