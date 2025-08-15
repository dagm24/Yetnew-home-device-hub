"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Chatbot } from "@/components/chatbot"
import { MessageCircle, Bot } from "lucide-react"

export function ChatbotButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">AI Assistant</span>
        <span className="sm:hidden">Ask AI</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-900/20 dark:to-violet-900/20">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-1.5 rounded">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg">Yetnew Assistant</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <Chatbot onClose={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
