"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ProfileClient = ({ session }: any) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    console.log(formData);
    // Ensure session is not null before accessing its properties
    if (session) {
      formData.append('file', image);
      formData.append('userId', session.user.id);
    } else {
      // Handle the case where session is null
      console.error('Session is null');
    }

    console.log(formData);

    const response = await fetch('/api/profile/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Handle successful upload
    } else {
      // Handle error
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-image">
        {session?.user.imageUrl ? (
          <img src={session.user.imageUrl} alt="Profile Image" />
        ) : (
          <p>No profile image</p>
        )}
      </div>
      <Input type="file" onChange={handleImageChange} />
      <Button onClick={handleImageUpload}>Upload Image</Button>
    </div>
  );
};

export default ProfileClient;
