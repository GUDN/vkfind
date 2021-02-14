import { makeUrl } from './utils'
import { getUsers, User } from './user'
import { qfetch } from '../utils/networkQueue'

export async function getMutual(users: User[]): Promise<Map<User, number>> {
  const userIds = users.map(user => user.userId)
  const values: Map<number, number> = new Map()
  while (userIds.length > 1) {
    const sourceId = userIds.splice(0, 1)[0].toString()
    for (let i = 0; i * 100 < userIds.length; i++) {
      const url = makeUrl('friends.getMutual', [
        ['source_uid', sourceId],
        ['target_uids', userIds.slice(i * 100, (i + 1) * 100).join(',')],
      ])
      const resp = await qfetch(url)
      if (!resp.ok) {
        console.error('Cannot make query')
        return new Map()
      }
      const content = await resp.json()
      if (content.error) {
        console.error('Cannot make query')
        return new Map()
      }
      for (const r of content.response) {
        for (const uid of r.common_friends) {
          values.set(uid, (values.get(uid) ?? 0) + 1)
        }
      }
    }
  }
  const keys: number[] = []
  for (const [k, v] of values.entries()) {
    keys.push(k)
  }
  return new Map(
    (await getUsers(keys)).map(user => [user, values.get(user.userId)])
  )
}
