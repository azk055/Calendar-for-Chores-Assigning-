import { useState } from 'react'
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns'
import { VIEWS } from '../constants'

export function useCalendarNav() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState(VIEWS.MONTH)

  function goToday() { setCurrentDate(new Date()) }

  function goNext() {
    setCurrentDate(d => {
      if (currentView === VIEWS.MONTH)  return addMonths(d, 1)
      if (currentView === VIEWS.WEEK)   return addWeeks(d, 1)
      if (currentView === VIEWS.DAY)    return addDays(d, 1)
      if (currentView === VIEWS.AGENDA) return addDays(d, 7)
      return d
    })
  }

  function goPrev() {
    setCurrentDate(d => {
      if (currentView === VIEWS.MONTH)  return subMonths(d, 1)
      if (currentView === VIEWS.WEEK)   return subWeeks(d, 1)
      if (currentView === VIEWS.DAY)    return subDays(d, 1)
      if (currentView === VIEWS.AGENDA) return subDays(d, 7)
      return d
    })
  }

  return { currentDate, setCurrentDate, currentView, setCurrentView, goToday, goNext, goPrev }
}
