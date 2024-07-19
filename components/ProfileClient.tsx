"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Session } from 'next-auth';
import { format } from 'date-fns';

const ProfileClient = ({ session }: { session: Session }) => {
  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(session.user.firstName || '');
  const [lastName, setLastName] = useState(session.user.lastName || '');
  const [dob, setDob] = useState<string>(format(new Date(session.user.DOB), 'yyyy-MM-dd'));
  const [isDobEditable, setIsDobEditable] = useState(true);

  useEffect(() => {
    //console.log(session.user);
    if (session?.user.DOB === null) {
      setIsDobEditable(false);
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    if (session) {
      formData.append('file', image);
      formData.append('userId', session.user.id);
    } else {
      console.error('Session is null');
    }

    const response = await fetch('/api/profile/upload', {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      // Handle successful upload
    } else {
      // Handle error
    }
  };

  const handleProfileUpdate = async () => {
    const response = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session?.user.id,
        firstName,
        lastName,
        dob: isDobEditable ? dob : session.user.DOB,
      }),
    });

    if (response.ok) {
      // Handle successful update
      setIsEditing(false);
      if (isDobEditable) {
        setIsDobEditable(false);
      }
    } else {
      // Handle error
      console.error('Error updating user:', response);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${isEditing? "min-h-screen self-center" : ""} bg-gray-100 dark:bg-gray-900`}>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-[500px] max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Profile</h1>
        <div>
        <div className="profile-image flex relative  mb-6">
          {session?.user.imageUrl ? (
            <div className="flex  rounded-full overflow-hidden w-32 h-32 mx-auto">
              <Image src={session.user.imageUrl} alt="Profile Image" width={128} height={128} className="object-cover" />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full overflow-hidden w-32 h-32 mx-auto">
              <Image src="/assets/icons8-user-96.png" alt="Profile Image" width={128} height={128} className="object-cover dark:filter dark:invert dark:grayscale" />
            </div>
          )}
              <p className="absolute left-[280px] bottom-10 text-2xl text-gray-800 dark:text-gray-200 text-center mb-6">
                <strong> {session?.user.userName}</strong>
              </p>
          {!isEditing && <Button onClick={() => setIsEditing(true)} className="absolute left-[220px] bottom-0 hover:bg-white h-10 w-10 text-white rounded-full p-2 shadow-md transition">
            <EditIcon />
          </Button>}
              </div>
              <div className='flex flex-col mb-4'>
              <p className="text-sm text-light-text dark:text-dark-text text-center">{session?.user.email}</p>
              {!isEditing && <div className='flex space-x-2 self-center bottom-0'>
              <p className="text-lg text-gray-800 dark:text-gray-200"><strong>{session?.user.firstName}</strong> </p>
              <p className="text-lg text-gray-800 dark:text-gray-200"><strong>{session?.user.lastName}</strong> </p>
            </div>}
              </div>
        </div>
        {isEditing && (
          <div className="flex items-center justify-center mb-6 gap-2">
            <Input type="file" onChange={handleImageChange} className="" />
            <Button onClick={handleImageUpload} className="bg-green-500 text-white hover:bg-green-600 transition">
                <SaveIcon className="mr-2" /> Upload Image
              </Button>
          </div>
        )}
        <div className="profile-details mb-6">
          {isEditing && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Email</label>
                <Input type="email" value={session?.user.email} disabled />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">First Name</label>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Date of Birth</label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isDobEditable}
                />
              </div>
            </>
          )

          }
        </div>
        {isEditing && (
          <div className="flex flex-col items-center">
            <div className="flex space-x-4">

              <Button onClick={handleProfileUpdate} className="bg-green-500 text-white hover:bg-green-600 transition">
                <SaveIcon className="mr-2" /> Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} className="bg-red-500 text-white hover:bg-red-600 transition">
                <CancelIcon className="mr-2" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileClient;
