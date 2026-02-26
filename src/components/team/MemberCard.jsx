import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import AvatarBubble from './AvatarBubble'
import MemberForm from './MemberForm'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useAppState } from '../../context/AppContext'
import { DELETE_MEMBER } from '../../context/actions'

export default function MemberCard({ member }) {
  const { state, dispatch } = useAppState()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  // Count assigned chores
  const choreCount = state.chores.filter(c => c.assigneeIds.includes(member.id)).length

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
        <AvatarBubble name={member.name} color={member.avatarColor} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800">{member.name}</div>
          {member.role && <div className="text-sm text-gray-400">{member.role}</div>}
          <div className="text-xs text-gray-400 mt-0.5">{choreCount} chore{choreCount !== 1 ? 's' : ''} assigned</div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <MemberForm isOpen={showEdit} onClose={() => setShowEdit(false)} member={member} />
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => dispatch({ type: DELETE_MEMBER, payload: { id: member.id } })}
        title="Remove member?"
        message={`Remove ${member.name} from the team? They will be unassigned from all chores.`}
      />
    </>
  )
}
