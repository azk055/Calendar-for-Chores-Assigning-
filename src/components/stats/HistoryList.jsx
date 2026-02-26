import { format, parseISO } from 'date-fns'
import AvatarBubble from '../team/AvatarBubble'
import { useAppState } from '../../context/AppContext'

export default function HistoryList() {
  const { state } = useAppState()

  const sorted = [...state.history].sort((a, b) =>
    new Date(b.completedAt ?? b.date) - new Date(a.completedAt ?? a.date)
  )

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No completions yet. Mark some chores done!</p>
  }

  return (
    <div className="space-y-2">
      {sorted.slice(0, 50).map(event => {
        const member = state.members.find(m => m.id === event.memberId)
        return (
          <div key={event.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            {member ? (
              <AvatarBubble name={member.name} color={member.avatarColor} size="sm" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-700 truncate">{event.choreTitle}</div>
              <div className="text-xs text-gray-400">{member?.name ?? 'Unknown'}</div>
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0">
              {format(parseISO(event.date + 'T00:00:00'), 'MMM d')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
