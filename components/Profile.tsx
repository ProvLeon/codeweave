import React from 'react';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  const { user } = session;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={user.imageUrl} alt={`${user.name}'s profile picture`} className="profile-image" />
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </div>
      <style jsx>{`
        .profile-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
        }
        .profile-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
        }
        .profile-name {
          font-size: 2rem;
          margin: 0;
        }
        .profile-email {
          font-size: 1rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Profile;
