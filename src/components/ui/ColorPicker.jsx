import { Check } from 'lucide-react'

export default function ColorPicker({ colors, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(({ key, hex }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(hex)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          style={{ backgroundColor: hex }}
          title={key}
        >
          {value === hex && <Check size={14} className="text-white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  )
}
