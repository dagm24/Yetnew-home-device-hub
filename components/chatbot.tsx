"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDevices } from "@/context/device-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatbotProps {
  onClose: () => void
}

export function Chatbot({ onClose }: ChatbotProps) {
  const { devices, storageBoxes } = useDevices()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your Yetnew Assistant. I can help you find devices, check their status, and answer questions about your household inventory. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      // Check if we have OpenAI API key
      const hasOpenAI = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY

      if (!hasOpenAI) {
        // Fallback to local AI responses
        const response = generateLocalResponse(userMessage, devices, storageBoxes)
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Send request to API route
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            devices,
            storageBoxes,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get response")
        }

        const data = await response.json()

        // Add AI response to chat
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again or check if your devices are properly synced.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 opacity-70 ${
                    message.role === "user" ? "text-pink-100" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === "user" && (
                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your devices..."
            disabled={isLoading}
            className="flex-1 text-sm sm:text-base"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-3 sm:px-4"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
          {["Show all devices", "What needs repair?", "Find power drill", "Storage boxes"].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs bg-transparent px-2 sm:px-3"
              onClick={() => setInput(suggestion)}
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Local AI response generator for when OpenAI is not available
function generateLocalResponse(message: string, devices: any[], storageBoxes: any[]): string {
  const lowerMessage = message.toLowerCase()

  // Device search
  if (lowerMessage.includes("find") || lowerMessage.includes("where") || lowerMessage.includes("locate")) {
    const searchTerms = message
      .split(" ")
      .filter((word) => !["find", "where", "is", "the", "my", "locate", "search", "for"].includes(word.toLowerCase()))

    if (searchTerms.length > 0) {
      const matchingDevices = devices.filter((device) =>
        searchTerms.some(
          (term) =>
            device.name.toLowerCase().includes(term.toLowerCase()) ||
            device.category.toLowerCase().includes(term.toLowerCase()) ||
            device.notes.toLowerCase().includes(term.toLowerCase()),
        ),
      )

      if (matchingDevices.length > 0) {
        const device = matchingDevices[0]
        const box = device.storageBox ? storageBoxes.find((b) => b.id === device.storageBox) : null

        let response = `Found "${device.name}"!\n\n`
        response += `📍 Location: ${device.location}\n`
        response += `📦 Category: ${device.category}\n`
        response += `⚡ Status: ${device.status.replace("-", " ")}\n`

        if (box) {
          response += `📦 Storage: ${box.name}`
          if (device.compartmentNumber) {
            response += ` → Compartment #${device.compartmentNumber}`
          }
          response += `\n📍 Box Location: ${box.location}`
        }

        if (device.notes) {
          response += `\n📝 Notes: ${device.notes}`
        }

        return response
      } else {
        return `I couldn't find any devices matching "${searchTerms.join(" ")}". Try searching by device name, category, or check your spelling.`
      }
    }
  }

  // Status queries
  if (lowerMessage.includes("repair") || lowerMessage.includes("broken") || lowerMessage.includes("fix")) {
    const needsRepair = devices.filter((d) => d.status === "needs-repair" || d.status === "broken")

    if (needsRepair.length === 0) {
      return "Great news! All your devices are working properly. No repairs needed! ✅"
    }

    let response = `Found ${needsRepair.length} device(s) that need attention:\n\n`
    needsRepair.forEach((device, index) => {
      response += `${index + 1}. ${device.name}\n`
      response += `   Status: ${device.status.replace("-", " ")}\n`
      response += `   Location: ${device.location}\n`
      if (device.notes) {
        response += `   Notes: ${device.notes}\n`
      }
      response += "\n"
    })

    return response
  }

  // List all devices
  if (
    lowerMessage.includes("all devices") ||
    lowerMessage.includes("show devices") ||
    lowerMessage.includes("list devices")
  ) {
    if (devices.length === 0) {
      return "You haven't added any devices yet. Click 'Add Device' to get started!"
    }

    let response = `You have ${devices.length} device(s):\n\n`
    devices.slice(0, 10).forEach((device, index) => {
      response += `${index + 1}. ${device.name} (${device.category})\n`
      response += `   Status: ${device.status.replace("-", " ")}\n`
      response += `   Location: ${device.location}\n\n`
    })

    if (devices.length > 10) {
      response += `... and ${devices.length - 10} more devices.`
    }

    return response
  }

  // Storage boxes
  if (lowerMessage.includes("storage") || lowerMessage.includes("box") || lowerMessage.includes("compartment")) {
    if (storageBoxes.length === 0) {
      return "You haven't created any storage boxes yet. Storage boxes help you organize your devices by location and compartment."
    }

    let response = `You have ${storageBoxes.length} storage box(es):\n\n`
    storageBoxes.forEach((box, index) => {
      const devicesInBox = devices.filter((d) => d.storageBox === box.id)
      response += `${index + 1}. ${box.name}\n`
      response += `   Location: ${box.location}\n`
      response += `   Compartments: ${box.compartments}\n`
      response += `   Devices stored: ${devicesInBox.length}\n\n`
    })

    return response
  }

  // Default response
  return `I can help you with:
• Finding specific devices ("find power drill")
• Checking device status ("what needs repair?")
• Listing all devices ("show all devices")
• Storage box information ("storage boxes")
• Device locations and details

What would you like to know about your devices?`
}
