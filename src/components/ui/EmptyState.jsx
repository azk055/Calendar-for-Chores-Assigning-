import Button from './Button'

export default function EmptyState({ icon: Icon, title, subtitle, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
          <Icon size={32} className="text-violet-400" />
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-700 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400 mb-6 max-w-xs">{subtitle}</p>}
      {action && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  )
}
