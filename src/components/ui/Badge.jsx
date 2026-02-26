import { clsx } from 'clsx'

export default function Badge({ label, color, className }) {
  return (
    <span
      className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', className)}
      style={color ? { backgroundColor: color + '22', color } : {}}
    >
      {label}
    </span>
  )
}
