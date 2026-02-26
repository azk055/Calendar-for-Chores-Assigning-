import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ColorPicker from '../ui/ColorPicker'
import AvatarBubble from '../team/AvatarBubble'
import { CHORE_COLORS, RECURRENCE } from '../../constants'
import { useAppState } from '../../context/AppContext'
import { ADD_CHORE, UPDATE_CHORE } from '../../context/actions'

const defaultForm = (date) => ({
  title: '',
  description: '',
  date: date ?? format(new Date(), 'yyyy-MM-dd'),
  recurrence: RECURRENCE.ONCE,
  recurrenceEnd: '',
  assigneeIds: [],
  color: CHORE_COLORS[0].hex,
})

export default function ChoreForm({ isOpen, onClose, chore, initialDate }) {
  const { state, dispatch } = useAppState()
  const isEdit = !!chore
  const [form, setForm] = useState(defaultForm(initialDate))

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          title: chore.title,
          description: chore.description ?? '',
          date: chore.date,
          recurrence: chore.recurrence,
          recurrenceEnd: chore.recurrenceEnd ?? '',
          assigneeIds: chore.assigneeIds ?? [],
          color: chore.color ?? CHORE_COLORS[0].hex,
        })
      } else {
        setForm(defaultForm(initialDate))
      }
    }
  }, [isOpen, chore, initialDate, isEdit])

  function toggleAssignee(id) {
    setForm(f => ({
      ...f,
      assigneeIds: f.assigneeIds.includes(id)
        ? f.assigneeIds.filter(a => a !== id)
        : [...f.assigneeIds, id],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = {
      ...form,
      recurrenceEnd: form.recurrenceEnd || null,
    }
    if (isEdit) {
      dispatch({ type: UPDATE_CHORE, payload: { id: chore.id, changes: payload } })
    } else {
      dispatch({ type: ADD_CHORE, payload })
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Chore' : 'New Chore'} size="md">
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Wash the dishes"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Optional details..."
            rows={2}
          />
        </div>

        {/* Date + Recurrence row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Repeats</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={form.recurrence}
              onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}
            >
              <option value={RECURRENCE.ONCE}>Once</option>
              <option value={RECURRENCE.DAILY}>Daily</option>
              <option value={RECURRENCE.WEEKLY}>Weekly</option>
            </select>
          </div>
        </div>

        {/* Recurrence end date */}
        {form.recurrence !== RECURRENCE.ONCE && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">End date (optional)</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={form.recurrenceEnd}
              min={form.date}
              onChange={e => setForm(f => ({ ...f, recurrenceEnd: e.target.value }))}
            />
          </div>
        )}

        {/* Assignees */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to</label>
          {state.members.length === 0 ? (
            <p className="text-xs text-gray-400">Add team members first to assign chores.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.members.map(member => {
                const selected = form.assigneeIds.includes(member.id)
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAssignee(member.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={selected
                      ? { borderColor: member.avatarColor, backgroundColor: member.avatarColor + '18', color: member.avatarColor }
                      : { borderColor: '#e5e7eb', color: '#6b7280' }
                    }
                  >
                    <AvatarBubble name={member.name} color={member.avatarColor} size="xs" />
                    {member.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
          <ColorPicker colors={CHORE_COLORS} value={form.color} onChange={hex => setForm(f => ({ ...f, color: hex }))} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Chore'}</Button>
        </div>
      </form>
    </Modal>
  )
}
