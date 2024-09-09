'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  user: any;
  updateUser: (newUserData: any) => void;
  fetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode, initialUser: any }> = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const updateUser = (newUserData: any) => {
    // fetchUser()
    setUser((prevUser: any) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
