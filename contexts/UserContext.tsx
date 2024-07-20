'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  user: any;
  updateUser: (newUserData: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode, initialUser: any }> = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  const updateUser = (newUserData: any) => {
    setUser((prevUser: any) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
