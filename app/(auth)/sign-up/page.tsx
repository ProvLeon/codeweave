"use client"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';

const RegisterPage = () => {
  const { theme } = useTheme();
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);  // New state for loading
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/sign-in')
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

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
            <CardTitle className="text-2xl font-bold text-light-heading dark:text-dark-heading">Sign Up</CardTitle>
            <CardDescription className="text-light-text dark:text-dark-text">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className='text-light-text dark:text-gray-200'>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <TextField
                  id="userName"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={userDetails.userName}
                  onChange={(e) => setUserDetails({...userDetails, userName: e.target.value.toLowerCase()})}
                  required
                  InputProps={{
                    style: {
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={userDetails.firstName}
                  onChange={(e) => setUserDetails({...userDetails, firstName: e.target.value})}
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
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={userDetails.lastName}
                  onChange={(e) => setUserDetails({...userDetails, lastName: e.target.value})}
                  required
                  InputProps={{
                    style: {
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>
                  </div>
              <div className="space-y-2">
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
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
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}
                  required
                  InputProps={{
                    style: {
                      borderRadius: '8px',
                    },
                  }}
                />
              </div>
            {error && <p className="text-red-500 self-center">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="default" className="w-full" loading={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default RegisterPage
