import { Gender } from '../stores/searchOptions'
import { qfetch } from '../utils/networkQueue'
import { makeUrl } from './utils'

export interface User {
  userId: number
  firstName: string
  lastName: string
  gender: Gender
  photo: string

  closed: boolean

  // TODO add another field
}

export async function getUser(userId: number): Promise<User> {
  const url = makeUrl('users.get', [
    ['user_ids', userId.toString()],
    ['fields', 'sex,photo_50'],
  ])
  const resp = await qfetch(url)
  if (!resp.ok) {
    throw new Error('VK API error')
  }
  const content = await resp.json()
  if (content.error) {
    throw new Error(content.error.error_msg)
  }
  const user = content.response[0]
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
  return {
    firstName: user.first_name,
    lastName: user.last_name,
    userId: userId,
    closed: !(user.can_access_closed as boolean) || 'deactivated' in user,
    gender,
    photo: user.photo_50,
  }
}

export async function getUsers(userIds: number[]): Promise<User[]> {
  // TODO implement function
  return []
}
