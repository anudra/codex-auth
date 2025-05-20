"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RegistrationForm from '../../components/registrationForm';

export default function CompleteProfile() {
  const [rollNo, setRollNo] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [username, setName] = useState("");
  const [collegename, setCollegeName] = useState("");
  const [loading, setLoading] = useState(true);     
  const [error, setError] = useState('');
  const router = useRouter();
  const { update } = useSession();

  const waitForSessionUpdate = async () => {
    for (let i = 0; i < 10; i++) {
      const session = await update();
      if (
        session?.user?.rollNo &&
        session?.user?.semester &&
        session?.user?.branch
      ) {
        return true;
      }
      await new Promise(res => setTimeout(res, 500));
    }
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'rollNo') setRollNo(value);
    if (name === 'semester') setSemester(value);
    if (name === 'branch') setBranch(value);
    if(name === 'username') setName(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/complete-profile', {
      method: 'POST',
      body: JSON.stringify({ rollNo, semester, branch, username }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      await waitForSessionUpdate();
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update profile');
    }
  };

  useEffect(() => {     
    const fetchProfile = async () => {       
      const res = await fetch("/api/user-profile");       
      if (!res.ok) {         
        setLoading(false);          
        return;       
      }       
      const dbProfile = await res.json();       
      setName(dbProfile.user_name);
      setCollegeName(dbProfile.college_name);      
      setLoading(false);     
    };     
    fetchProfile(); }, []);    
    
  if (loading) {     
    return (       
      <div className="flex items-center justify-center h-screen">         
        <div className="loader"></div>       
      </div>     
    );   
  }   

  return (
    <RegistrationForm
      rollNo={rollNo}
      semester={semester}
      branch={branch}
      username={username}
      collegename={collegename}
      error={error}
      onChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}