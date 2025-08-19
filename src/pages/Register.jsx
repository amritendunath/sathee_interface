import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Phone } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // const response = await fetch('http://localhost:5004/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username: email, password }),
      // })

      // const data = await response.json()

      // if (!response.ok) {
      //   throw new Error(data.error || 'Registration failed')
      // }

      // Redirect to login page after successful registration
      navigate('/emailVerification') // Replace '/login' with your actual login route n
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message)
    }
  }

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:5004/register/${provider}`
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/04.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Card className="bg-white/90 backdrop-blur-sm w-[350px] mx-auto p-5 shadow-xl rounded-[32px]">
        <CardHeader className="space-y-0.5 p-0">
          <CardDescription className="text-3xl text-center">
            Create Account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 p-0">
          <div className="grid grid-cols-2 gap-3">
          <Button
              variant="outline"
              // onClick={() => handleOAuthLogin('phone')}
              className="rounded-[32px] w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google"
            >
              <Phone className="mr-2 h-4 w-4" />
              Phone
            </Button>
            <Button
              variant="outline"
              // onClick={() => handleOAuthLogin('google')}
              className="rounded-[32px] w-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(66,133,244,0.5)] hover:scale-[1.02] button-glow-google"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Label htmlFor="email" className="text-sm"></Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-md rounded-[32px] px-4 h-12 border-2 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="text-sm"></Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-[32px] px-4 h-12 text-md border-2 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              type="submit"
              className="text-md rounded-[32px] px-4 h-12 font-semibold w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Continue
            </Button>
            <div className="text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register