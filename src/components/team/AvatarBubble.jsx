import { clsx } from 'clsx'

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const sizes = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

export default function AvatarBubble({ name, color, size = 'md', className, ring }) {
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-bold text-white flex-shrink-0',
        sizes[size],
        ring && 'ring-2 ring-offset-1 ring-white',
        className
      )}
      style={{ backgroundColor: color || '#8B5CF6' }}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
