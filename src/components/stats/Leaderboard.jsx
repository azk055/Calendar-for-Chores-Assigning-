import { Trophy } from 'lucide-react'
import AvatarBubble from '../team/AvatarBubble'
import CompletionBar from './CompletionBar'
import StreakDisplay from './StreakDisplay'
import { buildLeaderboard, calcStreak } from '../../utils/statsUtils'
import { useAppState } from '../../context/AppContext'

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { state } = useAppState()
  const board = buildLeaderboard(state.history, state.members)
  const maxCount = board[0]?.count ?? 1

  if (state.members.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No members yet.</p>
  }

  return (
    <div className="space-y-3">
      {board.map(({ member, count }, i) => {
        const streak = calcStreak(state.history, member.id)
        return (
          <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
            <span className="w-6 text-center text-base">{medals[i] ?? `${i + 1}`}</span>
            <AvatarBubble name={member.name} color={member.avatarColor} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-gray-800 truncate">{member.name}</span>
                <StreakDisplay streak={streak} />
              </div>
              <CompletionBar count={count} max={maxCount} color={member.avatarColor} />
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold" style={{ color: member.avatarColor }}>{count}</div>
              <div className="text-[10px] text-gray-400">30 days</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
