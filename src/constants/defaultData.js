import { format, addDays, subDays } from 'date-fns'

const today = format(new Date(), 'yyyy-MM-dd')
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

export const DEFAULT_MEMBERS = [
  { id: 'member-1', name: 'Alice',   role: 'Kitchen Lead', avatarColor: '#8B5CF6', createdAt: today },
  { id: 'member-2', name: 'Bob',     role: 'Outdoors',     avatarColor: '#0EA5E9', createdAt: today },
  { id: 'member-3', name: 'Charlie', role: 'Living Room',  avatarColor: '#10B981', createdAt: today },
]

export const DEFAULT_CHORES = [
  {
    id: 'chore-1',
    title: 'Wash the dishes',
    description: 'Clean all dishes after dinner and put them away.',
    date: today,
    recurrence: 'daily',
    recurrenceEnd: null,
    assigneeIds: ['member-1'],
    completedDates: [yesterday],
    color: '#8B5CF6',
    createdAt: today,
  },
  {
    id: 'chore-2',
    title: 'Take out trash',
    description: 'Collect all bins and take to the curb.',
    date: today,
    recurrence: 'weekly',
    recurrenceEnd: null,
    assigneeIds: ['member-2'],
    completedDates: [],
    color: '#0EA5E9',
    createdAt: today,
  },
  {
    id: 'chore-3',
    title: 'Vacuum living room',
    description: 'Vacuum the carpet and mop the floor.',
    date: tomorrow,
    recurrence: 'weekly',
    recurrenceEnd: null,
    assigneeIds: ['member-3', 'member-1'],
    completedDates: [],
    color: '#10B981',
    createdAt: today,
  },
  {
    id: 'chore-4',
    title: 'Grocery shopping',
    description: 'Buy items from the shared shopping list.',
    date: tomorrow,
    recurrence: 'once',
    recurrenceEnd: null,
    assigneeIds: ['member-2', 'member-3'],
    completedDates: [],
    color: '#F59E0B',
    createdAt: today,
  },
]

export const DEFAULT_STATE = {
  members: DEFAULT_MEMBERS,
  chores: DEFAULT_CHORES,
  history: [
    {
      id: 'hist-1',
      choreId: 'chore-1',
      choreTitle: 'Wash the dishes',
      memberId: 'member-1',
      date: yesterday,
      completedAt: yesterday + 'T20:00:00.000Z',
    },
  ],
  notifications: {
    enabled: false,
    minutesBefore: 60,
  },
}
