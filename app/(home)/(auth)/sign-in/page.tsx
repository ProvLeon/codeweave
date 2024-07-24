'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import Link from 'next/link';
//import { useSession } from 'next-auth/react';
import { useUser } from '@/contexts/UserContext';
//import axios from 'axios';

export default function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // New state for loading
  const router = useRouter();
  const { updateUser } = useUser();
  //const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      //redirect: false,
    });

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (response?.url && response.status === 401 || result?.url && result.status === 401) {
      //console.error('Sign-in error:', response);
      setError(`${response.statusText}: Incorrect Email or Password.`);
    } else if (response.status === 404 || result?.status === 404) {
      //console.error('Sign-in error:', response);
      setError(`Connection Error`);
    } else {
      //if (session) {
        const {user} = await response.json();
        //console.log('User Session:', session);
        //console.log('User:', user.profile);
        updateUser({...user, ...user.profile, userName:user.profile.username});
        //console.log('Sign-in successful:', user);
        router.push('/dashboard');
      //}
    }
    setEmail('');
    setPassword('');
    setLoading(false);
  };

  const muiTheme = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-light-heading dark:text-dark-heading">Sign In</CardTitle>
            <CardDescription className="text-light-text dark:text-dark-text">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="text-light-text dark:text-gray-200">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
              <div className="space-y-2">
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              {error && (
                <div className="text-red-500">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
              <Button type="submit" variant="default" className="w-full" loading={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <p className='text-light-text dark:text-dark-text'>Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link></p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}
