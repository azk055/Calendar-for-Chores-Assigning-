import { parseISO, isWithinInterval, addDays, addWeeks, max, min, isAfter, format, getDay } from 'date-fns'

/**
 * Expand chores into virtual instances for a date window.
 * @param {Array} chores
 * @param {Date} windowStart
 * @param {Date} windowEnd
 * @returns {Array} VirtualChoreInstance[]
 */
export function expandChores(chores, windowStart, windowEnd) {
  const instances = []

  for (const chore of chores) {
    if (!chore.date) continue
    const anchor = parseISO(chore.date)

    if (chore.recurrence === 'once') {
      if (isWithinInterval(anchor, { start: windowStart, end: windowEnd })) {
        instances.push(makeInstance(chore, chore.date))
      }
      continue
    }

    const recurrenceEnd = chore.recurrenceEnd ? parseISO(chore.recurrenceEnd) : null
    const effectiveEnd = recurrenceEnd ? min([recurrenceEnd, windowEnd]) : windowEnd
    const effectiveStart = max([anchor, windowStart])

    if (isAfter(effectiveStart, effectiveEnd)) continue

    if (chore.recurrence === 'daily') {
      let cursor = effectiveStart
      while (!isAfter(cursor, effectiveEnd)) {
        instances.push(makeInstance(chore, format(cursor, 'yyyy-MM-dd')))
        cursor = addDays(cursor, 1)
      }
    } else if (chore.recurrence === 'weekly') {
      // Find first occurrence on/after effectiveStart that matches anchor's weekday
      const anchorDay = getDay(anchor) // 0=Sun
      let cursor = effectiveStart
      // Advance to the next matching weekday
      while (getDay(cursor) !== anchorDay) {
        cursor = addDays(cursor, 1)
      }
      // But also ensure cursor >= anchor
      if (isAfter(anchor, cursor)) cursor = anchor

      while (!isAfter(cursor, effectiveEnd)) {
        instances.push(makeInstance(chore, format(cursor, 'yyyy-MM-dd')))
        cursor = addWeeks(cursor, 1)
      }
    }
  }

  return instances
}

function makeInstance(chore, instanceDate) {
  return {
    choreId: chore.id,
    instanceDate,
    chore,
    isComplete: chore.completedDates?.includes(instanceDate) ?? false,
    instanceKey: `${chore.id}::${instanceDate}`,
  }
}

/** Filter instances by assigned member ID */
export function filterByMember(instances, memberId) {
  if (!memberId) return instances
  return instances.filter(i => i.chore.assigneeIds.includes(memberId))
}

/** Group instances by instanceDate → Map<string, VirtualChoreInstance[]> */
export function groupByDate(instances) {
  const map = new Map()
  for (const inst of instances) {
    if (!map.has(inst.instanceDate)) map.set(inst.instanceDate, [])
    map.get(inst.instanceDate).push(inst)
  }
  return map
}
