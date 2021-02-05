import { writable } from 'svelte/store'
import type { Result } from '../engine/result'

export const results = writable<Result[]>([])
