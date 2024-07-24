"use client"
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ComponentType } from 'react';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import {useUser} from '@/contexts/UserContext'

const withAuth = (WrappedComponent: ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {user} = useUser()
    const pathname = usePathname()

    useEffect(() => {
      if (status === 'unauthenticated' && pathname !== '/') {
        router.push('/sign-in');
      } else if (status === 'unauthenticated' && pathname === '/') {
        router.push('/');
      }
    }, [status, router, user]);

    if (status === 'loading') {
      if (WrappedComponent.displayName === 'Header' || WrappedComponent.name === 'Header') {
        return null;
      }
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} session={session} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default withAuth;
