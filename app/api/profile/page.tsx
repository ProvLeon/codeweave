import React from 'react';
import { getSession } from '@/lib/Session';
import ProfileClient from './ProfileClient';

const ProfilePage = async () => {
  const session = await getSession();

  return <ProfileClient session={session} />;
};

export default ProfilePage;
