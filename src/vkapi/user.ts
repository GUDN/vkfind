import { Gender } from '../stores/searchOptions'
import { qfetch } from '../utils/networkQueue'
import { makeUrl } from './utils'

export interface User {
  userId: number
  firstName: string
  lastName: string
  gender: Gender
  photo: string
  settedCity: string | null

  closed: boolean

  // TODO add another field
}

export async function getUsers(userIds: number[]): Promise<User[]> {
  const result = []
  while (result.length < userIds.length) {
    const url = makeUrl('users.get', [
      [
        'user_ids',
        userIds.slice(result.length, result.length + 1000).join(','),
      ],
      ['fields', 'sex,photo_50,city'],
    ])
    const resp = await qfetch(url)
    if (!resp.ok) {
      throw new Error('VK API error')
    }
    const content = await resp.json()
    if (content.error) {
      throw new Error(content.error.error_msg)
    }
    for (const user of content.response) {
      let gender: Gender = null
      switch (user.sex as number) {
        case 1:
          gender = Gender.Female
          break
        case 2:
          gender = Gender.Male
          break
        default:
          gender = Gender.Unsetted
          break
      }
      const isDeactivated = 'deactivated' in user
      result.push({
        firstName: user.first_name,
        lastName: user.last_name,
        userId: user.id,
        closed: !(user.can_access_closed as boolean) || isDeactivated,
        gender,
        photo: user.photo_50,
        settedCity: isDeactivated || !user.city ? null : user.city.title,
      })
    }
  }
  return result
}
