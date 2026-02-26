import { useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { useAppState } from '../../context/AppContext'
import { SET_NOTIFICATION_PREFS } from '../../context/actions'
import Button from '../ui/Button'

export default function NotificationSetup() {
  const { state, dispatch } = useAppState()
  const [dismissed, setDismissed] = useState(false)

  const supported = typeof Notification !== 'undefined'
  const permission = supported ? Notification.permission : 'denied'
  const enabled = state.notifications?.enabled

  async function handleEnable() {
    if (!supported) return
    const result = await Notification.requestPermission()
    if (result === 'granted') {
      dispatch({ type: SET_NOTIFICATION_PREFS, payload: { enabled: true } })
    }
  }

  function handleDisable() {
    dispatch({ type: SET_NOTIFICATION_PREFS, payload: { enabled: false } })
  }

  // Don't show if already enabled, dismissed, or not supported
  if (!supported || dismissed || enabled) return null
  if (permission === 'denied') return null
  if (permission === 'granted' && !enabled) {
    // Auto-enable if permission already granted
    dispatch({ type: SET_NOTIFICATION_PREFS, payload: { enabled: true } })
    return null
  }

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 animate-slide-up">
      <Bell size={18} className="text-amber-500 flex-shrink-0" />
      <p className="flex-1 text-sm text-amber-800 font-medium">
        Enable browser reminders for upcoming chores?
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setDismissed(true)}>
          Not now
        </Button>
        <Button size="sm" onClick={handleEnable}>
          Enable
        </Button>
      </div>
      <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600 p-1">
        <X size={14} />
      </button>
    </div>
  )
}
