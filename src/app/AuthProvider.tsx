'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

function AuthLogger() {
  const { data: session, status } = useSession()
  useEffect(() => {
    console.log('[AuthLogger] status:', status)
    console.log('[AuthLogger] session:', session)
  }, [status, session])
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthLogger />
      {children}
    </SessionProvider>
  )
}