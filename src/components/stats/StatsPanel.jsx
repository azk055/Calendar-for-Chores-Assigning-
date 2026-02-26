import { useState } from 'react'
import { Trophy, Clock } from 'lucide-react'
import Modal from '../ui/Modal'
import Leaderboard from './Leaderboard'
import HistoryList from './HistoryList'
import { clsx } from 'clsx'

const tabs = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'history',     label: 'History',     icon: Clock },
]

export default function StatsPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('leaderboard')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Stats" size="md">
      {/* Tabs */}
      <div className="flex gap-1 mx-6 mt-4 mb-2 bg-gray-100 rounded-xl p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === id ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-6 pt-2">
        {activeTab === 'leaderboard' ? <Leaderboard /> : <HistoryList />}
      </div>
    </Modal>
  )
}
