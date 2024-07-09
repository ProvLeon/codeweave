"use client"
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const RegisterPage = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-light-heading dark:text-dark-heading">Sign Up</CardTitle>
          <CardDescription className="text-light-text dark:text-dark-text">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className='text-light-text dark:text-gray-200'>
          <CardContent className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={userDetails.firstName}
                onChange={(e) => setUserDetails({...userDetails, firstName: e.target.value})}
                required
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={userDetails.lastName}
                onChange={(e) => setUserDetails({...userDetails, lastName: e.target.value})}
                required
                />
            </div>
                </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="John-Doe@example.com"
                value={userDetails.email}
                onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={userDetails.password}
                onChange={(e) => setUserDetails({...userDetails, password: (e.target.value)})}
                required
              />
            </div>
          {error && <p className="text-red-500 self-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="default" className="w-full">
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
