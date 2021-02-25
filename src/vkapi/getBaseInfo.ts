import { qfetch } from '../utils/networkQueue'
import { makeUrl } from './utils'

export async function getBaseInfo(
  raw: string
): Promise<{ value: string; userId: number; closed: boolean }> {
  if (raw.startsWith('vk.com/')) {
    raw = raw.slice(7)
  }
  const url = makeUrl('users.get', [['user_ids', raw]])
  const content = await qfetch(url)
  if (content.error) {
    return null
  }
  const user = content.response[0]
  let value = `${user.first_name} ${user.last_name}`
  if (!user.can_access_closed) {
    value += ' (нет доступа)'
  }
  return {
    value,
    userId: user.id as number,
    closed: !(user.can_access_closed as boolean) || 'deactivated' in user,
  }
}
