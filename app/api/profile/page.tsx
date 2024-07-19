import React from 'react';
import { getSessionServer } from '@/lib/Session';
import ProfileClient from '../../../components/ProfileClient';
import { redirect } from 'next/navigation';

const ProfilePage =  async () => {
  const session = await getSessionServer();
  if (session === null) {
    return redirect('/sign-in');
  }

  return (session && <ProfileClient session={session} />);
};

export default ProfilePage;
