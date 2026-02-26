import { STORAGE_KEY } from '../constants'
import { DEFAULT_STATE } from '../constants/defaultData'

export function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage quota exceeded — silently fail
  }
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getInitialState() {
  return readStorage() ?? DEFAULT_STATE
}
