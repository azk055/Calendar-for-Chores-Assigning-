import { useState } from 'react'
import { format, isToday, startOfDay, endOfDay } from 'date-fns'
import { getWeekDays, toDayKey } from '../../utils/dateUtils'
import { expandChores, filterByMember, groupByDate } from '../../utils/choreUtils'
import ChoreCard from '../chore/ChoreCard'
import ChoreModal from '../chore/ChoreModal'
import DroppableDay from '../dnd/DroppableDay'
import DraggableChore from '../dnd/DraggableChore'
import { useAppState } from '../../context/AppContext'
import { clsx } from 'clsx'

export default function WeekView({ currentDate, filteredMemberId, onAddChore, onDayClick }) {
  const { state } = useAppState()
  const [selectedInstance, setSelectedInstance] = useState(null)

  const days = getWeekDays(currentDate)
  const windowStart = startOfDay(days[0])
  const windowEnd = endOfDay(days[days.length - 1])

  const instances = filterByMember(
    expandChores(state.chores, windowStart, windowEnd),
    filteredMemberId
  )
  const byDate = groupByDate(instances)

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
        {days.map(day => {
          const today = isToday(day)
          return (
            <div
              key={toDayKey(day)}
              onClick={() => onDayClick?.(day)}
              className="flex flex-col items-center py-3 cursor-pointer hover:bg-white transition-colors"
            >
              <span className="text-xs font-semibold text-gray-400 uppercase">{format(day, 'EEE')}</span>
              <span className={clsx(
                'w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mt-1',
                today ? 'bg-violet-500 text-white' : 'text-gray-700'
              )}>
                {format(day, 'd')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Chore columns */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto divide-x divide-gray-100">
        {days.map(day => {
          const key = toDayKey(day)
          const dayInstances = byDate.get(key) ?? []
          const today = isToday(day)

          return (
            <DroppableDay
              key={key}
              dayKey={key}
              className={clsx('p-2 space-y-1.5 min-h-32', today && 'bg-violet-50/40')}
            >
              {dayInstances.map(inst => (
                <DraggableChore key={inst.instanceKey} instanceKey={inst.instanceKey}>
                  {({ isDragging }) => (
                    <ChoreCard instance={inst} onClick={setSelectedInstance} isDragging={isDragging} />
                  )}
                </DraggableChore>
              ))}
              <button
                onClick={() => onAddChore(key)}
                className="w-full py-1 text-xs text-gray-300 hover:text-violet-400 hover:bg-violet-50 rounded-lg transition-colors"
              >
                + add
              </button>
            </DroppableDay>
          )
        })}
      </div>

      <ChoreModal
        instance={selectedInstance}
        isOpen={!!selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </div>
  )
}
