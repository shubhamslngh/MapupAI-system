"use client"

import { useFleetStore } from "@/store/fleetStore"

export default function AlertsPanel() {
    const { alerts, focusVehicle } = useFleetStore()

    if (alerts.length === 0)
        return <div className="p-3 w-[20rem] text-sm text-muted-foreground">No recent alerts 🎉</div>

    const recent = alerts.slice(-10).reverse()

    return (
        <div className="space-y-2 p-3">
            {recent.map((a, i) => (
                <div
                    key={i}
                    onClick={() => {
                        // extract vehicle id from alert title if present
                        const match = a.title.match(/(VH_\d+)/)
                        if (match) {
                            focusVehicle(match[1])
                        }
                    }}
                    className={`
            flex items-center gap-2 p-2 rounded-md border-l-4 cursor-pointer transition-all
            hover:scale-[1.02] active:scale-[0.98]
            ${a.type === "error"
                            ? "border-red-500 bg-red-100/70 hover:bg-red-200"
                            : a.type === "warning"
                                ? "border-yellow-500 bg-yellow-100/70 hover:bg-yellow-200"
                                : a.type === "success"
                                    ? "border-green-500 bg-green-100/70 hover:bg-green-200"
                                    : "border-blue-500 bg-blue-100/70 hover:bg-blue-200"
                        }
          `}
                >
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(a.time).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
