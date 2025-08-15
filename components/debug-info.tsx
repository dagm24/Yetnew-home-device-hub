"use client"

import { useDevices } from "@/context/device-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DebugInfo() {
  const { isSupabaseReady, isMounted, devices, storageBoxes } = useDevices()

  if (!isMounted) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="flex items-center gap-2">
          <span>Mounted:</span>
          <Badge variant={isMounted ? "default" : "secondary"}>{isMounted ? "Yes" : "No"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Supabase Ready:</span>
          <Badge variant={isSupabaseReady ? "default" : "secondary"}>{isSupabaseReady ? "Yes" : "No"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Supabase URL:</span>
          <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "secondary"}>
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not Set"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Supabase Key:</span>
          <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "secondary"}>
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Devices Count:</span>
          <Badge>{devices.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span>Storage Boxes Count:</span>
          <Badge>{storageBoxes.length}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
