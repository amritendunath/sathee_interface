

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'  // Add useState import
// Add this import at the top with other imports
import { Key } from "lucide-react"



import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./ui/input-otp"
import { data } from "autoprefixer"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function InputOTPForm() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data) {
    try {
      const phoneNumber = sessionStorage.getItem('phoneNumber')
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please try again.')
      }

      const response = await fetch('http://localhost:5004/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: '+91' + phoneNumber,
          code: data.pin 
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Invalid OTP')
      }

      localStorage.setItem('token', result.token)
      navigate('/chatbox')
    } catch (error) {
      console.error('OTP verification failed:', error)
      setError(error.message)
    }
  }

  const handleResendOTP = async () => {
    try {
      const phoneNumber = sessionStorage.getItem('phoneNumber')
      if (!phoneNumber) {
        throw new Error('Phone number not found')
      }

      const response = await fetch('http://localhost:5004/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: '+91' + phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend OTP')
      }

      setError('OTP resent successfully')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/04.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm w-[350px] mx-auto p-5 shadow-xl rounded-[32px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormDescription className="text-center">
                    Enter the 6-digit code sent to your phone.
                  </FormDescription>
                  <FormControl className="flex justify-center">
                    <InputOTP maxLength={6} {...field} className="flex justify-center">
                      <InputOTPGroup className="gap-1">
                        <InputOTPSlot
                          index={0}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                        <InputOTPSlot
                          index={1}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                        <InputOTPSlot
                          index={2}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                        <span className="text-3xl text-gray-600 mx-2">-</span>
                        <InputOTPSlot
                          index={3}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                        <InputOTPSlot
                          index={4}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                        <InputOTPSlot
                          index={5}
                          className="border-2 border-gray-900/20 focus:border-gray-900/40 shadow-md rounded-md"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-md font-semibold rounded-[32px] px-4 h-12 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
            >
              <Key className="w-5 h-5" />
              Verify OTP
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Didn't get the code?</span>
              <Button
                type="button"
                variant="link"
                className="flex-[0.4] text-sm font-medium rounded-[32px] px-3 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-400"
                onClick={handleResendOTP}
              >
                Resend
              </Button>
            </div>
          </form>
        </Form>
        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}
        {/* <div className="text-center mt-3">
          Already have an account?{" "}
          <a href="/register" className="text-blue-600 ">
            Log in
          </a>
        </div> */}
      </div>
    </div>
  )
}
