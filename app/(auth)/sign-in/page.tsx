'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // New state for loading
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);  // Set loading state to true when the form is submitted

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.url && result.error ) {
      console.error('Sign-in error:', result);
      setError(`${result.error}: Incorrect Email or Password.`)
    } else if (result?.error && !result.url) {
      localStorage.setItem('error', result.error.split(']')[1]);
      console.error('Sign-in error:', result);
      setError(`${result.error}: Connection Error`);
    } else {
      console.log('Sign-in successful:', result);
      router.push('/dashboard');
    }
    setEmail('');
    setPassword('');

    setLoading(false);  // Set loading state to false after processing the result
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
                  }}
                />
              </div>
              {error && (
                <div className="text-red-500">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="default" className="w-full" loading={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
}
