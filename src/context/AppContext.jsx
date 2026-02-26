import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { reducer } from './reducer'
import { getInitialState, writeStorage } from '../utils/storageUtils'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  // Sync to localStorage on every state change
  useEffect(() => {
    writeStorage(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used inside AppProvider')
  return ctx
}
