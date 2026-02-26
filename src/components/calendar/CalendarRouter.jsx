import { VIEWS } from '../../constants'
import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'
import AgendaView from './AgendaView'

export default function CalendarRouter({ currentView, currentDate, filteredMemberId, onAddChore, onDayClick }) {
  const props = { currentDate, filteredMemberId, onAddChore, onDayClick }

  switch (currentView) {
    case VIEWS.MONTH:  return <MonthView  {...props} />
    case VIEWS.WEEK:   return <WeekView   {...props} />
    case VIEWS.DAY:    return <DayView    {...props} />
    case VIEWS.AGENDA: return <AgendaView {...props} />
    default:           return <MonthView  {...props} />
  }
}
