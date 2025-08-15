"use client"

import { useDevices } from "@/context/device-context"
import { Badge } from "@/components/ui/badge"

export function ConnectionStatus() {
  const { isSupabaseReady, isMounted } = useDevices()

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isSupabaseReady ? "default" : "secondary"} className="text-xs">
        {isSupabaseReady ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Real-time sync
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
            Local storage
          </>
        )}
      </Badge>
    </div>
  )
}
