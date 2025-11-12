"use client"

import { Progress } from "@/components/ui/progress"

export default function TripProgressBar({ planned, travelled }) {
    const percent = Math.min((travelled / planned) * 100, 100).toFixed(1)

    return (
        <div className="w-full space-y-1">
            <Progress value={percent} className="h-2" />
            <p className="text-xs text-muted-foreground">{percent}% completed</p>
        </div>
    )
}
