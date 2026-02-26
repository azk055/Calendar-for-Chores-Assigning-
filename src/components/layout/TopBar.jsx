import { ClipboardList, Plus, Users, BarChart2, Bell } from 'lucide-react'
import { VIEWS } from '../../constants'
import Button from '../ui/Button'
import { clsx } from 'clsx'

const viewLabels = {
  [VIEWS.MONTH]:  'Month',
  [VIEWS.WEEK]:   'Week',
  [VIEWS.DAY]:    'Day',
  [VIEWS.AGENDA]: 'Agenda',
}

export default function TopBar({ currentView, onViewChange, onAddChore, onShowTeam, onShowStats, todayLabel }) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
          <ClipboardList size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-800 hidden sm:block text-sm">ChoreBoard</span>
      </div>

      {/* View Tabs */}
      <nav className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 flex-1 max-w-xs">
        {Object.entries(viewLabels).map(([view, label]) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={clsx(
              'flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all',
              currentView === view
                ? 'bg-white text-violet-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Today label */}
      {todayLabel && (
        <span className="hidden md:block text-sm font-semibold text-gray-500">{todayLabel}</span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onShowTeam} title="Manage Team">
          <Users size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onShowStats} title="Stats">
          <BarChart2 size={18} />
        </Button>
        <Button size="sm" onClick={onAddChore} className="hidden sm:inline-flex">
          <Plus size={16} /> Add Chore
        </Button>
        <Button size="icon" onClick={onAddChore} className="sm:hidden">
          <Plus size={18} />
        </Button>
      </div>
    </header>
  )
}
