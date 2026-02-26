import { useEffect, useRef } from 'react'
import { expandChores } from '../utils/choreUtils'
import { format, addDays, startOfDay, endOfDay, parseISO } from 'date-fns'

export function useNotifications(chores, notificationPrefs) {
  const timeoutIds = useRef([])

  useEffect(() => {
    // Clear previous scheduled notifications
    timeoutIds.current.forEach(id => clearTimeout(id))
    timeoutIds.current = []

    if (!notificationPrefs?.enabled) return
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return

    const minutesBefore = notificationPrefs.minutesBefore ?? 60
    const now = new Date()
    const windowStart = startOfDay(now)
    const windowEnd = endOfDay(addDays(now, 1))

    const instances = expandChores(chores, windowStart, windowEnd)

    for (const inst of instances) {
      if (inst.isComplete) continue

      // We treat all chores as due at midnight (start of day) since we don't have times
      // Notification fires `minutesBefore` minutes before that — which for "today" means we fire now if overdue
      const dueDate = parseISO(inst.instanceDate)
      const fireAt = new Date(dueDate.getTime() - minutesBefore * 60 * 1000)
      const delay = fireAt.getTime() - now.getTime()

      if (delay < 0 || delay > 24 * 60 * 60 * 1000) continue // skip past and too-far-future

      const id = setTimeout(() => {
        try {
          new Notification(`ChoreBoard: ${inst.chore.title}`, {
            body: inst.chore.description || `Due ${format(dueDate, 'MMM d')}`,
            icon: '/favicon.ico',
            tag: inst.instanceKey,
          })
        } catch {
          // Notification API not available
        }
      }, delay)

      timeoutIds.current.push(id)
    }

    return () => {
      timeoutIds.current.forEach(id => clearTimeout(id))
    }
  }, [chores, notificationPrefs])
}
