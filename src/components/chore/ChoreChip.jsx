import { Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useAppState } from '../../context/AppContext'
import { TOGGLE_COMPLETE } from '../../context/actions'

export default function ChoreChip({ instance, onClick }) {
  const { dispatch } = useAppState()
  const { chore, instanceDate, isComplete } = instance

  function handleToggle(e) {
    e.stopPropagation()
    dispatch({
      type: TOGGLE_COMPLETE,
      payload: { choreId: chore.id, instanceDate, memberId: chore.assigneeIds[0] ?? '' },
    })
  }

  return (
    <div
      onClick={() => onClick?.(instance)}
      className={clsx(
        'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer transition-all truncate group',
        isComplete ? 'opacity-50 line-through' : 'hover:opacity-90'
      )}
      style={{ backgroundColor: chore.color + '22', color: chore.color }}
    >
      <button
        onClick={handleToggle}
        className="w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0"
        style={{ borderColor: chore.color, backgroundColor: isComplete ? chore.color : 'transparent' }}
      >
        {isComplete && <Check size={8} strokeWidth={3} style={{ color: 'white' }} />}
      </button>
      <span className="truncate">{chore.title}</span>
    </div>
  )
}
