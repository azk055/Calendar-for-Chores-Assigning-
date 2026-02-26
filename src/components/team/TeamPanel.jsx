import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import MemberCard from './MemberCard'
import MemberForm from './MemberForm'
import EmptyState from '../ui/EmptyState'
import { useAppState } from '../../context/AppContext'

export default function TeamPanel({ isOpen, onClose }) {
  const { state } = useAppState()
  const [showAdd, setShowAdd] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Manage Team" size="md">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{state.members.length} member{state.members.length !== 1 ? 's' : ''}</p>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add Member
            </Button>
          </div>

          {state.members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No team members yet"
              subtitle="Add your first member to start assigning chores."
              action={() => setShowAdd(true)}
              actionLabel="Add Member"
            />
          ) : (
            <div className="space-y-3">
              {state.members.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <MemberForm isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </>
  )
}
