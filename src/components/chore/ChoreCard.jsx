import { useState } from 'react'
import { Check, Repeat } from 'lucide-react'
import AvatarBubble from '../team/AvatarBubble'
import RecurrenceBadge from './RecurrenceBadge'
import { useAppState } from '../../context/AppContext'
import { TOGGLE_COMPLETE } from '../../context/actions'
import { clsx } from 'clsx'

export default function ChoreCard({ instance, onClick, isDragging }) {
  const { state, dispatch } = useAppState()
  const { chore, instanceDate, isComplete } = instance

  const assignees = state.members.filter(m => chore.assigneeIds.includes(m.id))

  function handleToggle(e) {
    e.stopPropagation()
    dispatch({
      type: TOGGLE_COMPLETE,
      payload: {
        choreId: chore.id,
        instanceDate,
        memberId: assignees[0]?.id ?? '',
      },
    })
  }

  return (
    <div
      onClick={() => onClick?.(instance)}
      className={clsx(
        'group relative flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all',
        'hover:shadow-md select-none',
        isComplete ? 'opacity-60 bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-gray-200',
        isDragging && 'shadow-xl scale-105 rotate-1 z-50'
      )}
      style={{ borderLeftWidth: 4, borderLeftColor: chore.color }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={clsx(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
          isComplete
            ? 'border-transparent'
            : 'border-gray-300 hover:border-violet-400'
        )}
        style={isComplete ? { backgroundColor: chore.color } : {}}
      >
        {isComplete && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={clsx('text-sm font-semibold text-gray-800', isComplete && 'line-through text-gray-400')}>
          {chore.title}
        </div>
        {chore.description && (
          <div className="text-xs text-gray-400 mt-0.5 truncate">{chore.description}</div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <RecurrenceBadge recurrence={chore.recurrence} />
          {/* Assignee bubbles */}
          <div className="flex -space-x-1">
            {assignees.slice(0, 3).map(m => (
              <AvatarBubble key={m.id} name={m.name} color={m.avatarColor} size="xs" ring />
            ))}
            {assignees.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 ring-2 ring-white">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
