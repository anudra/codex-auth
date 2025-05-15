'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}>
      <h1>Welcome to Codex Auth</h1>

      {session ? (
        <>
          <p>Signed in as {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            style={{
              marginTop: 20,
              padding: '8px 16px',
              background: '#DB4437',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn('google')}
          style={{
            marginTop: 20,
            padding: '8px 16px',
            background: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Sign in with Google
        </button>
      )}
    </main>
  )
}
