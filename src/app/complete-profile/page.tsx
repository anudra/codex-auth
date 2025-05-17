'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const [rollNo, setRollNo] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/complete-profile', {
      method: 'POST',
      body: JSON.stringify({ rollNo, semester, branch }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update profile');
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}>
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <input
          type="text"
          placeholder="Roll No"
          value={rollNo}
          onChange={e => setRollNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={e => setSemester(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={e => setBranch(e.target.value)}
          required
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, background: '#4285F4', color: '#fff', border: 'none' }}>
          Submit
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </main>
  );
}