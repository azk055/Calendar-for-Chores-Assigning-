import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { format } from 'date-fns'

import { useAppState } from './context/AppContext'
import { useCalendarNav } from './hooks/useCalendarNav'
import { useNotifications } from './hooks/useNotifications'

import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import MobileNav from './components/layout/MobileNav'
import CalendarHeader from './components/calendar/CalendarHeader'
import CalendarRouter from './components/calendar/CalendarRouter'
import ChoreForm from './components/chore/ChoreForm'
import TeamPanel from './components/team/TeamPanel'
import StatsPanel from './components/stats/StatsPanel'
import NotificationSetup from './components/notifications/NotificationSetup'
import DndProvider from './components/dnd/DndProvider'

import { VIEWS } from './constants'

export default function App() {
  const { state } = useAppState()
  const { currentDate, setCurrentDate, currentView, setCurrentView, goToday, goNext, goPrev } = useCalendarNav()

  const [filteredMemberId, setFilteredMemberId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showChoreForm, setShowChoreForm] = useState(false)
  const [choreFormDate, setChoreFormDate] = useState(null)
  const [showTeam, setShowTeam] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Browser notifications
  useNotifications(state.chores, state.notifications)

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'm') setCurrentView(VIEWS.MONTH)
      if (e.key === 'w') setCurrentView(VIEWS.WEEK)
      if (e.key === 'd') setCurrentView(VIEWS.DAY)
      if (e.key === 'a') setCurrentView(VIEWS.AGENDA)
      if (e.key === 'n') { setChoreFormDate(null); setShowChoreForm(true) }
      if (e.key === 't') goToday()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setCurrentView, goToday])

  function handleAddChore(dateStr) {
    setChoreFormDate(dateStr ?? null)
    setShowChoreForm(true)
  }

  function handleDayClick(day) {
    setCurrentDate(day)
    setCurrentView(VIEWS.DAY)
    setSidebarOpen(false)
  }

  const todayLabel = format(new Date(), 'EEE, MMM d')

  return (
    <DndProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Top bar */}
        <TopBar
          currentView={currentView}
          onViewChange={setCurrentView}
          onAddChore={() => handleAddChore()}
          onShowTeam={() => setShowTeam(true)}
          onShowStats={() => setShowStats(true)}
          todayLabel={todayLabel}
        />

        {/* Notification banner */}
        <NotificationSetup />

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            members={state.members}
            filteredMemberId={filteredMemberId}
            onFilter={setFilteredMemberId}
            onManageTeam={() => setShowTeam(true)}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Calendar area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <CalendarHeader
              currentDate={currentDate}
              currentView={currentView}
              onPrev={goPrev}
              onNext={goNext}
              onToday={goToday}
            />
            <CalendarRouter
              currentView={currentView}
              currentDate={currentDate}
              filteredMemberId={filteredMemberId}
              onAddChore={handleAddChore}
              onDayClick={handleDayClick}
            />
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav
          currentView={currentView}
          onViewChange={setCurrentView}
          onShowStats={() => setShowStats(true)}
        />

        {/* Modals */}
        <ChoreForm
          isOpen={showChoreForm}
          onClose={() => setShowChoreForm(false)}
          initialDate={choreFormDate}
        />
        <TeamPanel isOpen={showTeam} onClose={() => setShowTeam(false)} />
        <StatsPanel isOpen={showStats} onClose={() => setShowStats(false)} />

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </div>
    </DndProvider>
  )
}
