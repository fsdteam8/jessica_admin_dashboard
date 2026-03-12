/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface Sender {
  _id: string
  firstName: string
  role: "ADMIN" | "SELLER"
}

interface Message {
  _id: string
  message: string
  sender: Sender
  createdAt: string
  read: boolean
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  resourceId?: string
}

export function ChatModal({ isOpen, onClose, resourceId }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const session = useSession()
  const token = session?.data?.accessToken || ""

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && resourceId) {
      fetchMessages()
    }
  }, [isOpen, resourceId])

  /* ================= FETCH QUESTIONS + REPLIES ================= */

  const fetchMessages = async () => {
    if (!resourceId) return

    setIsLoading(true)
    setMessages([])

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/qa/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch questions")

      const data = await response.json()

      const formattedMessages: Message[] = []

      data.data.forEach((q: any) => {
        /* Question (askedBy) → RIGHT SIDE */

        formattedMessages.push({
          _id: q._id,
          message: q.question,
          sender: q.askedBy,
          createdAt: q.createdAt,
          read: true,
        })

        /* Replies (answers) → LEFT SIDE */

        q.replies.forEach((reply: any, index: number) => {
          formattedMessages.push({
            _id: `${q._id}-${index}`,
            message: reply.message,
            sender: reply.sender,
            createdAt: reply.createdAt,
            read: true,
          })
        })
      })

      const sortedMessages = formattedMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )

      setMessages(sortedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /* ================= SEND QUESTION ================= */

  const sendMessage = async () => {
    if (!newMessage.trim() || !resourceId || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/qa/${resourceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            resourceId,
            question: newMessage,
          }),
        }
      )

      if (!response.ok) throw new Error("Failed to send message")

      setNewMessage("")
      await fetchMessages()
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <div className="text-sm font-semibold">
            Chat - Resource ID: {resourceId}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {formatTime(new Date())}
          </div>
        </DialogHeader>

        {/* ================= CHAT BODY ================= */}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No messages found.
            </div>
          ) : (
            messages.map((message) => {
              /* askedBy → RIGHT */
              const isAskedBy = message.sender.role === "ADMIN"

              return (
                <div
                  key={message._id}
                  className={cn(
                    "flex",
                    isAskedBy ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="max-w-[80%] space-y-1">
                    {!isAskedBy && (
                      <div className="text-xs text-muted-foreground px-2">
                        {message.sender.firstName}
                      </div>
                    )}

                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 text-sm",
                        isAskedBy
                          ? "bg-slate-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      {message.message}
                    </div>

                    <div
                      className={cn(
                        "text-xs text-muted-foreground px-2",
                        isAskedBy ? "text-right" : "text-left"
                      )}
                    >
                      {formatTime(new Date(message.createdAt))}
                    </div>
                  </div>
                </div>
              )
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ================= INPUT ================= */}

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 rounded-full border-gray-300 focus:border-gray-400 focus:ring-0"
            />

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="rounded-full bg-slate-600 hover:bg-slate-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}