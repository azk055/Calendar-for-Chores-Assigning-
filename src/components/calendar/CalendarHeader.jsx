import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import { format } from 'date-fns'
import { VIEWS } from '../../constants'
import Button from '../ui/Button'

const titles = {
  [VIEWS.MONTH]:  (d) => format(d, 'MMMM yyyy'),
  [VIEWS.WEEK]:   (d) => format(d, "'Week of' MMM d, yyyy"),
  [VIEWS.DAY]:    (d) => format(d, 'EEEE, MMMM d, yyyy'),
  [VIEWS.AGENDA]: (d) => 'Upcoming Chores',
}

export default function CalendarHeader({ currentDate, currentView, onPrev, onNext, onToday }) {
  const title = (titles[currentView] ?? titles[VIEWS.MONTH])(currentDate)

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft size={18} />
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight size={18} />
      </Button>
      <h2 className="text-base font-bold text-gray-800 flex-1">{title}</h2>
      <Button variant="secondary" size="sm" onClick={onToday}>
        <CalendarCheck size={15} /> Today
      </Button>
    </div>
  )
}
