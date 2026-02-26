import { parseISO, subDays, isAfter, format, eachDayOfInterval, startOfDay } from 'date-fns'

/** Returns per-member completion counts over last `days` days */
export function computeStats(history, members, days = 30) {
  const cutoff = subDays(new Date(), days)
  const recent = history.filter(h => isAfter(parseISO(h.completedAt ?? h.date), cutoff))

  return members.map(member => {
    const count = recent.filter(h => h.memberId === member.id).length
    return { member, count }
  })
}

/** Returns sorted leaderboard array */
export function buildLeaderboard(history, members, days = 30) {
  return computeStats(history, members, days).sort((a, b) => b.count - a.count)
}

/** Returns current consecutive-day streak for a member */
export function calcStreak(history, memberId) {
  const memberHistory = history
    .filter(h => h.memberId === memberId)
    .map(h => h.date)

  const uniqueDays = [...new Set(memberHistory)].sort().reverse()
  if (uniqueDays.length === 0) return 0

  let streak = 0
  let cursor = startOfDay(new Date())

  for (const day of uniqueDays) {
    const d = parseISO(day)
    const cursorStr = format(cursor, 'yyyy-MM-dd')
    const dayStr = format(d, 'yyyy-MM-dd')

    if (dayStr === cursorStr) {
      streak++
      cursor = subDays(cursor, 1)
    } else if (dayStr === format(subDays(new Date(), streak + 1), 'yyyy-MM-dd')) {
      streak++
      cursor = subDays(cursor, 1)
    } else {
      break
    }
  }

  return streak
}

/** Total completions per member all time */
export function allTimeCount(history, memberId) {
  return history.filter(h => h.memberId === memberId).length
}
