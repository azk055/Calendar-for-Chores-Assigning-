const styles = {
  daily:  { label: 'Daily',  bg: '#ffedd5', color: '#ea580c' },
  weekly: { label: 'Weekly', bg: '#e0f2fe', color: '#0284c7' },
  once:   { label: 'Once',   bg: '#f3f4f6', color: '#6b7280' },
}

export default function RecurrenceBadge({ recurrence }) {
  const s = styles[recurrence] ?? styles.once
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}
