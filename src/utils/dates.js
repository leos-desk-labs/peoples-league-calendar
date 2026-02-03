import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'

export function getMonthDays(date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  const days = []
  let current = start

  while (current <= end) {
    days.push(current)
    current = addDays(current, 1)
  }

  return days
}

export function getWeekDays(date) {
  const start = startOfWeek(date)
  const days = []

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i))
  }

  return days
}

export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, formatStr)
}

export function formatShortDate(date) {
  return formatDate(date, 'MMM d')
}

export function formatMonthYear(date) {
  return formatDate(date, 'MMMM yyyy')
}

export function formatDayOfWeek(date) {
  return formatDate(date, 'EEE')
}

export function formatDayNumber(date) {
  return formatDate(date, 'd')
}

export { addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO }
