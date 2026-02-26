import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, parseISO, addDays, addMonths, addWeeks,
  isToday, isSameMonth, isSameDay,
} from 'date-fns'

export { isToday, isSameMonth, isSameDay, parseISO, format, addDays, addWeeks, addMonths }

/** Returns all days to display in a month grid (including leading/trailing days) */
export function getMonthGrid(date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  return eachDayOfInterval({ start, end })
}

/** Returns 7 days starting from the Monday (or Sunday) of the given date's week */
export function getWeekDays(date) {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  return eachDayOfInterval({ start, end })
}

/** Format a Date to 'yyyy-MM-dd' string */
export function toDayKey(date) {
  return format(date, 'yyyy-MM-dd')
}

/** Parse a 'yyyy-MM-dd' string to a Date */
export function fromDayKey(key) {
  return parseISO(key)
}
