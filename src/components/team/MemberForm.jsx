import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ColorPicker from '../ui/ColorPicker'
import { AVATAR_COLORS } from '../../constants'
import { useAppState } from '../../context/AppContext'
import { ADD_MEMBER, UPDATE_MEMBER } from '../../context/actions'

export default function MemberForm({ isOpen, onClose, member }) {
  const { dispatch } = useAppState()
  const isEdit = !!member

  const [form, setForm] = useState({
    name: member?.name ?? '',
    role: member?.role ?? '',
    avatarColor: member?.avatarColor ?? AVATAR_COLORS[0].hex,
  })

  function handleOpen() {
    setForm({
      name: member?.name ?? '',
      role: member?.role ?? '',
      avatarColor: member?.avatarColor ?? AVATAR_COLORS[0].hex,
    })
  }

  // Reset when modal opens
  if (isOpen && form.name === '' && member?.name) handleOpen()

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (isEdit) {
      dispatch({ type: UPDATE_MEMBER, payload: { id: member.id, changes: form } })
    } else {
      dispatch({ type: ADD_MEMBER, payload: form })
    }
    onClose()
    setForm({ name: '', role: '', avatarColor: AVATAR_COLORS[0].hex })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Member' : 'Add Member'} size="sm">
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Alice"
            autoFocus
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            placeholder="e.g. Kitchen Lead"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar Color</label>
          <ColorPicker
            colors={AVATAR_COLORS}
            value={form.avatarColor}
            onChange={hex => setForm(f => ({ ...f, avatarColor: hex }))}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Member'}</Button>
        </div>
      </form>
    </Modal>
  )
}
