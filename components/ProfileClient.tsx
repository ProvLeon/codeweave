"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUser } from '@/contexts/UserContext';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ProfileClient = () => {
  const { user, updateUser } = useUser();
  const { theme } = useTheme();
  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [dob, setDob] = useState<string>(user.dob || '');
  const [isDobEditable, setIsDobEditable] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [contact, setContact] = useState(user.contactNumber || '');

  useEffect(() => {
    if (user.dob === null) {
      setIsDobEditable(false);
    }
    console.log(dob)
  }, [user, dob]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    setImageLoading(true)

    const formData = new FormData();
    if (user) {
      formData.append('file', image);
      formData.append('userId', user.id);
    } else {
      console.error('Session is null');
    }

    const response = await fetch('/api/profile/upload', {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      if (data.profile.imageUrl) {
        console.log(data.profile.imageUrl)
        updateUser({ imageUrl: data.profile.imageUrl });
        setImage(null);
        setIsEditing(false);
      } else {
        console.error('Image URL not received from server');
      }
    } else {
      console.error('Error uploading image');
    }
    setImageLoading(false)
  };

  const handleProfileUpdate = async () => {
    console.log(user)
    const updatedUserData = {
      firstName,
      lastName,
      dob: isDobEditable ? dob : user.dob,
      contact,
    }
    const response = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        ...updatedUserData,
      }),
    });

    if (response.ok) {
      // Handle successful update
      const data = await response.json();
      console.log(data)
      updateUser({...user, ...data });
      setIsEditing(false);
      if (isDobEditable) {
        setIsDobEditable(false);
      }
    } else {
      // Handle error
      console.error('Error updating user:', response);
    }
    setIsDobEditable(false)
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <div className={`flex flex-col items-center justify-center ${isEditing? "backdrop-blur-lg bg-tranparent bg-opacity-70 animate-slide-in right-0 p-2 h-[96vh] w-screen self-center" : ""} bg-gray-100 dark:bg-gray-900 transition-all duration-300`}>
        <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-[500px] max-w-md transition-all duration-300 ${isEditing ? 'animate-slide-in' : 'animate-slide-out'}`}>
          {isEditing && <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Profile</h1>}
          <div>
            <div className="profile-image flex relative  mb-6">
              {user?.imageUrl ? (
                <div className="flex  rounded-full overflow-hidden w-32 h-32 mx-auto">
                  <Image src={user?.imageUrl} alt="Profile Image" width={128} height={128} className="object-cover" />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-full overflow-hidden w-32 h-32 mx-auto">
                  <Image src="/assets/icons8-user-96.png" alt="Profile Image" width={128} height={128} className="object-cover dark:filter dark:invert dark:grayscale" />
                </div>
              )}
              <p className="absolute left-[280px] bottom-5 mb-5 text-2xl text-gray-800 dark:text-gray-200 text-center ">
                <strong> {user?.userName}</strong>
              </p>
              {!isEditing && <Button onClick={() => setIsEditing(true)} className="absolute left-[220px] bottom-0 hover:bg-white h-10 w-10 text-white rounded-full p-2 shadow-md transition">
                <EditIcon />
              </Button>}
            </div>
            <div className='flex flex-col mb-4'>
              <p className="text-sm text-light-text dark:text-dark-text text-center">{user?.email}</p>
              {!isEditing && <div className='flex space-x-2 self-center bottom-0'>
                <p className="text-lg text-gray-800 dark:text-gray-200"><strong>{user?.firstName}</strong> </p>
                <p className="text-lg text-gray-800 dark:text-gray-200"><strong>{user?.lastName}</strong> </p>
              </div>}
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center justify-center mb-6 gap-2">
              <TextField
                type="file"
                onChange={handleImageChange}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  style: {
                    borderRadius: '8px',
                    fontSize: '12px',
                    alignContent: 'center'
                  },
                  className: 'text-light-text dark:text-dark-text'
                }}
                InputLabelProps={{
                  className: 'text-light-text dark:text-dark-text'
                }}
              />
              <Button onClick={handleImageUpload} loading={imageLoading} className="bg-green-500 text-white hover:bg-green-600 transition">
                <SaveIcon className="mr-2" /> Upload Image
              </Button>
            </div>
          )}
          <div className="profile-details mb-6">
            {isEditing && (
              <>
                <div className='flex gap-2'>
                  <div className="mb-4">
                    <TextField
                      label="First Name"
                      type="text"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      InputProps={{
                        style: {
                          borderRadius: '8px',
                        },
                        className: 'text-light-text dark:text-dark-text'
                      }}
                      InputLabelProps={{
                        className: 'text-light-text dark:text-dark-text'
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label="Last Name"
                      type="text"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      InputProps={{
                        style: {
                          borderRadius: '8px',
                        },
                        className: 'text-light-text dark:text-dark-text'
                      }}
                      InputLabelProps={{
                        className: 'text-light-text dark:text-dark-text'
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <PhoneInput
                    country={'us'}
                    value={contact}
                    onChange={(phone) => setContact(phone)}
                    inputStyle={{
                      width: '100%',
                      borderRadius: '8px',
                      height: '40px',
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      color: theme === 'dark' ? '#fff' : '#000',
                      border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
                      transition: 'background-color 0.3s, border-color 0.3s',
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                    buttonStyle={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      transition: 'background-color 0.3s, border-color 0.3s',
                    }}
                    //inputClass="text-light-text dark:text-dark-text"
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={dob ? new Date(dob).toISOString().split('T')[0] : ''}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={isDobEditable}
                    InputProps={{
                      style: {
                        borderRadius: '8px',
                      },
                      className: 'text-light-text dark:text-dark-text'
                    }}
                    InputLabelProps={{
                      className: 'text-light-text dark:text-dark-text'
                    }}
                  />
                </div>
              </>
            )}
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
    </ThemeProvider>
  );
};

export default ProfileClient;
