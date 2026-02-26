import { Users, X } from 'lucide-react'
import AvatarBubble from '../team/AvatarBubble'
import { clsx } from 'clsx'

export default function Sidebar({ members, filteredMemberId, onFilter, onManageTeam, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={clsx(
        'fixed md:relative inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200',
        'md:translate-x-0 md:flex',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-700">Filter by person</span>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        {/* All toggle */}
        <div className="px-3 pt-3">
          <button
            onClick={() => onFilter(null)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              filteredMemberId === null
                ? 'bg-violet-50 text-violet-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-white" />
            </div>
            All members
          </button>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {members.map(member => (
            <button
              key={member.id}
              onClick={() => onFilter(filteredMemberId === member.id ? null : member.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                filteredMemberId === member.id
                  ? 'bg-violet-50 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              style={filteredMemberId === member.id ? { color: member.avatarColor } : {}}
            >
              <AvatarBubble name={member.name} color={member.avatarColor} size="md"
                ring={filteredMemberId === member.id} />
              <div className="text-left min-w-0">
                <div className="truncate font-semibold">{member.name}</div>
                {member.role && (
                  <div className="text-xs text-gray-400 truncate">{member.role}</div>
                )}
              </div>
            </button>
          ))}

          {members.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No members yet</p>
          )}
        </div>

        {/* Manage team button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onManageTeam}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Users size={16} />
            Manage Team
          </button>
        </div>
      </aside>
    </>
  )
}
