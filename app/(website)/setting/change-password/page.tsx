"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const session = useSession();
  const token = session?.data?.accessToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.currentPassword) {
      setMessage("Current password is required")
      setMessageType("error")
      return
    }
    if (!formData.newPassword) {
      setMessage("New password is required")
      setMessageType("error")
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password changed successfully!")
        setMessageType("success")
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setMessage(data.message || "Failed to change password")
        setMessageType("error")
      }
    } catch {
      setMessage("Network error. Please try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#EDEEF1]">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Change Password</h1>
            <p className="text-gray-500">Dashboard &gt; Setting &gt; Change Password</p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4 mb-8">
              <Avatar className="h-[120px] w-[120px]">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Mr. Raja</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Message */}
                {message && (
                  <div
                    className={`p-4 rounded-md ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {message}
                  </div>
                )}

                {/* Password fields in one row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="mt-3 border border-[#707070] h-[60px]"
                      placeholder="Enter current password"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="mt-3 border border-[#707070] h-[60px]"
                      placeholder="Enter new password"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-3 border border-[#707070] h-[60px]"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#525773] hover:bg-[#535a80] text-white px-6 py-3 rounded-md"
                  >
                    {isLoading ? "Changing Password..." : "Change Password"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
