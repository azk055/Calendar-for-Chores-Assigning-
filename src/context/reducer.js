import {
  ADD_MEMBER, UPDATE_MEMBER, DELETE_MEMBER,
  ADD_CHORE, UPDATE_CHORE, DELETE_CHORE, RESCHEDULE_CHORE, TOGGLE_COMPLETE,
  SET_NOTIFICATION_PREFS, RESET_ALL, IMPORT_STATE,
} from './actions'
import { DEFAULT_STATE } from '../constants/defaultData'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'

export function reducer(state, action) {
  switch (action.type) {

    // ── Team ─────────────────────────────────────────────────────────
    case ADD_MEMBER:
      return {
        ...state,
        members: [...state.members, { ...action.payload, id: nanoid(), createdAt: format(new Date(), 'yyyy-MM-dd') }],
      }

    case UPDATE_MEMBER:
      return {
        ...state,
        members: state.members.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload.changes } : m
        ),
      }

    case DELETE_MEMBER: {
      const { id } = action.payload
      return {
        ...state,
        members: state.members.filter(m => m.id !== id),
        chores: state.chores.map(c => ({
          ...c,
          assigneeIds: c.assigneeIds.filter(aid => aid !== id),
        })),
        history: state.history.filter(h => h.memberId !== id),
      }
    }

    // ── Chores ───────────────────────────────────────────────────────
    case ADD_CHORE:
      return {
        ...state,
        chores: [
          ...state.chores,
          {
            ...action.payload,
            id: nanoid(),
            completedDates: [],
            createdAt: format(new Date(), 'yyyy-MM-dd'),
          },
        ],
      }

    case UPDATE_CHORE:
      return {
        ...state,
        chores: state.chores.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.changes } : c
        ),
      }

    case DELETE_CHORE: {
      const { id } = action.payload
      return {
        ...state,
        chores: state.chores.filter(c => c.id !== id),
        history: state.history.filter(h => h.choreId !== id),
      }
    }

    case RESCHEDULE_CHORE:
      return {
        ...state,
        chores: state.chores.map(c =>
          c.id === action.payload.id ? { ...c, date: action.payload.newDate } : c
        ),
      }

    case TOGGLE_COMPLETE: {
      const { choreId, instanceDate, memberId } = action.payload
      const chore = state.chores.find(c => c.id === choreId)
      if (!chore) return state

      const alreadyDone = chore.completedDates.includes(instanceDate)

      const updatedChores = state.chores.map(c => {
        if (c.id !== choreId) return c
        return {
          ...c,
          completedDates: alreadyDone
            ? c.completedDates.filter(d => d !== instanceDate)
            : [...c.completedDates, instanceDate],
        }
      })

      let updatedHistory = state.history
      if (alreadyDone) {
        updatedHistory = state.history.filter(
          h => !(h.choreId === choreId && h.date === instanceDate)
        )
      } else {
        updatedHistory = [
          ...state.history,
          {
            id: nanoid(),
            choreId,
            choreTitle: chore.title,
            memberId: memberId || (chore.assigneeIds[0] ?? ''),
            date: instanceDate,
            completedAt: new Date().toISOString(),
          },
        ]
      }

      return { ...state, chores: updatedChores, history: updatedHistory }
    }

    // ── Notifications ─────────────────────────────────────────────────
    case SET_NOTIFICATION_PREFS:
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload },
      }

    // ── Misc ──────────────────────────────────────────────────────────
    case RESET_ALL:
      return DEFAULT_STATE

    case IMPORT_STATE:
      return { ...DEFAULT_STATE, ...action.payload }

    default:
      return state
  }
}
