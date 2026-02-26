import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function DraggableChore({ instanceKey, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: instanceKey,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {typeof children === 'function' ? children({ isDragging }) : children}
    </div>
  )
}
