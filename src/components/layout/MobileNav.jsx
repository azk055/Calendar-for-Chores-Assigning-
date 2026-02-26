import { CalendarDays, CalendarRange, Calendar, List, BarChart2 } from 'lucide-react'
import { VIEWS } from '../../constants'
import { clsx } from 'clsx'

const tabs = [
  { view: VIEWS.MONTH,  icon: CalendarDays,  label: 'Month' },
  { view: VIEWS.WEEK,   icon: CalendarRange, label: 'Week' },
  { view: VIEWS.DAY,    icon: Calendar,      label: 'Day' },
  { view: VIEWS.AGENDA, icon: List,          label: 'Agenda' },
]

export default function MobileNav({ currentView, onViewChange, onShowStats }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 flex">
      {tabs.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={clsx(
            'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
            currentView === view ? 'text-violet-600' : 'text-gray-400'
          )}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
      <button
        onClick={onShowStats}
        className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-gray-400"
      >
        <BarChart2 size={20} />
        Stats
      </button>
    </nav>
  )
}
