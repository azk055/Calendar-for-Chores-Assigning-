import { Flame } from 'lucide-react'

export default function StreakDisplay({ streak }) {
  if (streak === 0) return null
  return (
    <div className="flex items-center gap-1 text-orange-500">
      <Flame size={14} />
      <span className="text-xs font-bold">{streak}</span>
    </div>
  )
}
