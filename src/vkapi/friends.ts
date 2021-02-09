import type { User } from './user'
import { qfetch } from '../utils/networkQueue'
import { makeUrl } from './utils'
import { Gender } from '../stores/searchOptions'

const FRIENDS_BY_RESPONSE = (5000).toString()

export async function getFriends(user: User): Promise<User[]> {
  if (user.closed) {
    return []
  }
  const resp = await qfetch(
    makeUrl('friends.get', [
      ['user_id', user.userId.toString()],
      ['fields', 'sex'],
      ['count', '1'],
    ])
  )
  if (!resp.ok) {
    console.error('Cannot fetch friends first response')
    return []
  }
  const content = await resp.json()
  if (content.error) {
    console.error(user, content.error.error_msg)
    throw new Error(content.error.error_msg)
  }
  const count = content.response.count as number
  const result: User[] = []
  while (result.length < count) {
    const url = makeUrl('friends.get', [
      ['user_id', user.userId.toString()],
      ['count', FRIENDS_BY_RESPONSE],
      ['offset', result.length.toString()],
      ['fields', 'sex'],
    ])
    const resp = await qfetch(url)
    if (!resp.ok) {
      console.error('Cannot make query')
    }
    const content = await resp.json()
    if (content.error) {
      console.error(content.error.error_msg)
      throw new Error(content.error.error_msg)
    }
    for (const friend of content.response.items) {
      let gender: Gender
      switch (friend.sex as number) {
        case 1:
          gender = Gender.Female
          break
        case 2:
          gender = Gender.Male
        default:
          gender = Gender.Unsetted
          break
      }
      result.push({
        firstName: friend.first_name,
        lastName: friend.last_name,
        closed:
          !(friend.can_access_closed as boolean) || 'deactivated' in friend,
        userId: friend.id,
        gender,
      })
    }
  }
  return result
}
