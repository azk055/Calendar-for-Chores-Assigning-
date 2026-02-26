import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAppState } from '../../context/AppContext'
import { RESCHEDULE_CHORE } from '../../context/actions'

export default function DndProvider({ children }) {
  const { state, dispatch } = useAppState()
  const [activeInstance, setActiveInstance] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart({ active }) {
    // Parse instanceKey: "choreId::instanceDate"
    const [choreId, instanceDate] = String(active.id).split('::')
    const chore = state.chores.find(c => c.id === choreId)
    if (chore) setActiveInstance({ chore, instanceDate, instanceKey: active.id })
  }

  function handleDragEnd({ active, over }) {
    setActiveInstance(null)
    if (!over) return

    const overStr = String(over.id)
    if (!overStr.startsWith('day::')) return

    const newDate = overStr.replace('day::', '')
    const [choreId, instanceDate] = String(active.id).split('::')

    if (newDate === instanceDate) return // dropped on same day

    const chore = state.chores.find(c => c.id === choreId)
    if (!chore) return

    dispatch({ type: RESCHEDULE_CHORE, payload: { id: choreId, newDate } })
    toast.success(`Moved to ${newDate}`, { icon: '📅' })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeInstance && (
          <div
            className="px-3 py-2 rounded-xl text-sm font-semibold text-white shadow-2xl rotate-2 cursor-grabbing"
            style={{ backgroundColor: activeInstance.chore.color }}
          >
            {activeInstance.chore.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
