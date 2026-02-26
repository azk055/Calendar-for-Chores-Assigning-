import { useState } from 'react'
import { format, startOfDay, addDays, isToday, isTomorrow } from 'date-fns'
import { List } from 'lucide-react'
import { expandChores, filterByMember, groupByDate } from '../../utils/choreUtils'
import { toDayKey } from '../../utils/dateUtils'
import ChoreCard from '../chore/ChoreCard'
import ChoreModal from '../chore/ChoreModal'
import EmptyState from '../ui/EmptyState'
import { useAppState } from '../../context/AppContext'

function dayHeading(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEEE, MMMM d')
}

export default function AgendaView({ currentDate, filteredMemberId }) {
  const { state } = useAppState()
  const [selectedInstance, setSelectedInstance] = useState(null)

  const windowStart = startOfDay(currentDate)
  const windowEnd = addDays(windowStart, 29)

  const instances = filterByMember(
    expandChores(state.chores, windowStart, windowEnd),
    filteredMemberId
  )
  const byDate = groupByDate(instances)

  // Build sorted list of days that have chores
  const days = []
  for (let i = 0; i < 30; i++) {
    const d = addDays(windowStart, i)
    const key = toDayKey(d)
    if (byDate.has(key)) days.push(key)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {days.length === 0 ? (
          <EmptyState
            icon={List}
            title="No upcoming chores"
            subtitle="No chores scheduled for the next 30 days."
          />
        ) : (
          days.map(dayKey => (
            <div key={dayKey} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-gray-700">{dayHeading(dayKey)}</span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">{format(new Date(dayKey + 'T00:00:00'), 'MMM d')}</span>
              </div>
              <div className="space-y-2">
                {byDate.get(dayKey).map(inst => (
                  <ChoreCard key={inst.instanceKey} instance={inst} onClick={setSelectedInstance} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ChoreModal
        instance={selectedInstance}
        isOpen={!!selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </div>
  )
}
