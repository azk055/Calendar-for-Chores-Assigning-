import { useDroppable } from '@dnd-kit/core'
import { clsx } from 'clsx'

export default function DroppableDay({ dayKey, children, className }) {
  const id = `day::${dayKey}`
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'transition-colors duration-150',
        isOver && 'bg-violet-50 ring-2 ring-inset ring-violet-300',
        className
      )}
    >
      {children}
    </div>
  )
}
