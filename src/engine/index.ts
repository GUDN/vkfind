import { get } from 'svelte/store'
import * as options from '../stores/searchOptions'

export async function search() {
  console.log(`Searching ${get(options.name)}...`)
}
