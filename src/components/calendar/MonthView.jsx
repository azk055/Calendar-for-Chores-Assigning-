import { useState } from 'react'
import { format, isToday, isSameMonth, startOfDay, endOfDay } from 'date-fns'
import { getMonthGrid, toDayKey } from '../../utils/dateUtils'
import { expandChores, filterByMember, groupByDate } from '../../utils/choreUtils'
import ChoreChip from '../chore/ChoreChip'
import ChoreModal from '../chore/ChoreModal'
import DroppableDay from '../dnd/DroppableDay'
import DraggableChore from '../dnd/DraggableChore'
import { DAYS_SHORT } from '../../constants'
import { useAppState } from '../../context/AppContext'
import { clsx } from 'clsx'

const MAX_VISIBLE = 3

export default function MonthView({ currentDate, filteredMemberId, onAddChore, onDayClick }) {
  const { state } = useAppState()
  const [selectedInstance, setSelectedInstance] = useState(null)
  const [overflowDay, setOverflowDay] = useState(null) // dayKey showing all chores

  const days = getMonthGrid(currentDate)
  const windowStart = startOfDay(days[0])
  const windowEnd = endOfDay(days[days.length - 1])

  const instances = filterByMember(
    expandChores(state.chores, windowStart, windowEnd),
    filteredMemberId
  )
  const byDate = groupByDate(instances)

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
        {DAYS_SHORT.map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold text-gray-400 uppercase">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 overflow-y-auto" style={{ gridAutoRows: 'minmax(100px, 1fr)' }}>
        {days.map(day => {
          const key = toDayKey(day)
          const dayInstances = byDate.get(key) ?? []
          const today = isToday(day)
          const inMonth = isSameMonth(day, currentDate)
          const visible = dayInstances.slice(0, MAX_VISIBLE)
          const overflow = dayInstances.length - MAX_VISIBLE

          return (
            <DroppableDay
              key={key}
              dayKey={key}
              className={clsx(
                'border-b border-r border-gray-100 p-1.5 flex flex-col',
                !inMonth && 'opacity-40',
                today && 'bg-violet-50/50'
              )}
            >
              {/* Day number */}
              <button
                onClick={() => onDayClick?.(day)}
                className={clsx(
                  'w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 transition-colors self-end',
                  today ? 'bg-violet-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {format(day, 'd')}
              </button>

              {/* Chore chips */}
              <div className="flex flex-col gap-0.5 flex-1">
                {visible.map(inst => (
                  <DraggableChore key={inst.instanceKey} instanceKey={inst.instanceKey}>
                    <ChoreChip instance={inst} onClick={setSelectedInstance} />
                  </DraggableChore>
                ))}
                {overflow > 0 && (
                  <button
                    onClick={() => onDayClick?.(day)}
                    className="text-[10px] text-violet-500 font-semibold px-1 hover:underline text-left"
                  >
                    +{overflow} more
                  </button>
                )}
                {dayInstances.length === 0 && (
                  <button
                    onClick={() => onAddChore(key)}
                    className="flex-1 flex items-center justify-center text-[10px] text-gray-200 hover:text-violet-300 transition-colors"
                  >
                    +
                  </button>
                )}
              </div>
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
