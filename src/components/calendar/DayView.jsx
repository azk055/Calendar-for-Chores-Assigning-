import { useState } from 'react'
import { format, startOfDay, endOfDay } from 'date-fns'
import { ClipboardList, Plus } from 'lucide-react'
import { expandChores, filterByMember } from '../../utils/choreUtils'
import ChoreCard from '../chore/ChoreCard'
import ChoreModal from '../chore/ChoreModal'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import { useAppState } from '../../context/AppContext'

export default function DayView({ currentDate, filteredMemberId, onAddChore }) {
  const { state } = useAppState()
  const [selectedInstance, setSelectedInstance] = useState(null)

  const dayStart = startOfDay(currentDate)
  const dayEnd = endOfDay(currentDate)
  const instances = filterByMember(
    expandChores(state.chores, dayStart, dayEnd),
    filteredMemberId
  )

  const dateStr = format(currentDate, 'yyyy-MM-dd')

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Date heading */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800">{format(currentDate, 'd')}</div>
          <div className="text-sm text-gray-400">{format(currentDate, 'EEEE, MMMM yyyy')}</div>
        </div>
        <Button size="sm" onClick={() => onAddChore(dateStr)}>
          <Plus size={15} /> Add chore
        </Button>
      </div>

      <div className="px-4 py-4 max-w-2xl">
        {instances.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No chores today"
            subtitle="Enjoy the day or add a new chore!"
            action={() => onAddChore(dateStr)}
            actionLabel="Add Chore"
          />
        ) : (
          <div className="space-y-3">
            {instances.map(inst => (
              <ChoreCard key={inst.instanceKey} instance={inst} onClick={setSelectedInstance} />
            ))}
          </div>
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
