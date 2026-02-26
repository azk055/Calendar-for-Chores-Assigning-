import { useState } from 'react'
import { Pencil, Trash2, Calendar, Repeat } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import AvatarBubble from '../team/AvatarBubble'
import RecurrenceBadge from './RecurrenceBadge'
import ConfirmDialog from '../ui/ConfirmDialog'
import ChoreForm from './ChoreForm'
import { useAppState } from '../../context/AppContext'
import { DELETE_CHORE, TOGGLE_COMPLETE } from '../../context/actions'

export default function ChoreModal({ instance, isOpen, onClose }) {
  const { state, dispatch } = useAppState()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  if (!instance) return null
  const { chore, instanceDate, isComplete } = instance
  const assignees = state.members.filter(m => chore.assigneeIds.includes(m.id))

  function handleToggle() {
    dispatch({
      type: TOGGLE_COMPLETE,
      payload: { choreId: chore.id, instanceDate, memberId: assignees[0]?.id ?? '' },
    })
  }

  function handleDelete() {
    dispatch({ type: DELETE_CHORE, payload: { id: chore.id } })
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen && !showEdit && !showDelete} onClose={onClose} size="sm">
        {/* Color banner */}
        <div className="h-2 rounded-t-2xl" style={{ backgroundColor: chore.color }} />

        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 leading-snug pr-4">{chore.title}</h2>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-violet-500 hover:bg-violet-50">
                <Pencil size={15} />
              </button>
              <button onClick={() => setShowDelete(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {chore.description && (
            <p className="text-sm text-gray-500 mb-4">{chore.description}</p>
          )}

          {/* Meta */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-400" />
              {format(parseISO(instanceDate), 'EEEE, MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Repeat size={14} className="text-gray-400" />
              <RecurrenceBadge recurrence={chore.recurrence} />
            </div>
          </div>

          {/* Assignees */}
          {assignees.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Assigned to</p>
              <div className="flex flex-wrap gap-2">
                {assignees.map(m => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: m.avatarColor + '18' }}>
                    <AvatarBubble name={m.name} color={m.avatarColor} size="xs" />
                    <span className="text-sm font-semibold" style={{ color: m.avatarColor }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete toggle */}
          <Button
            variant={isComplete ? 'secondary' : 'primary'}
            className="w-full"
            onClick={handleToggle}
          >
            {isComplete ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
        </div>
      </Modal>

      <ChoreForm isOpen={showEdit} onClose={() => setShowEdit(false)} chore={chore} />
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete chore?"
        message={`Delete "${chore.title}"? This will remove all occurrences and completion history.`}
      />
    </>
  )
}
