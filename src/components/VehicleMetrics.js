"use client"

import {
    Gauge,
    Compass,
    MapPin,
    Battery,
    Zap,
    SignalHigh,
    AlertTriangle,
    Clock,
    ArrowUp,
    Truck,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFleetStore } from "@/store/fleetStore"

export default function VehicleMetrics() {
    const { vehicles, selectedVehicleId } = useFleetStore()

    // If user hasn’t clicked anything yet, we just take first vehicle
    const activeVehicle =
        vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0]

    if (!activeVehicle || !activeVehicle.events?.length) {
        return (
            <div className="text-sm text-muted-foreground p-3">
                Click on any trip to see its live metrics here.
            </div>
        )
    }

    const current = activeVehicle.events[activeVehicle.index] || {}

    // calculating trip progress (simple distance %)
    const plannedDistance = activeVehicle.events[0]?.planned_distance_km || 100
    const travelled = current.distance || 0
    const percent = Math.min((travelled / plannedDistance) * 100, 100).toFixed(1)

    return (
        <Card className=" w-full p-4 mt-4 space-y-5">
            {/* Top header showing vehicle name and trip ID */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    <div>
                        <h3 className="font-semibold text-lg">
                            {activeVehicle.vehicleId}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Trip ID: {activeVehicle.tripName}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    {percent}% Completed
                </div>
            </div>

            {/* Trip completion progress bar */}
            <Progress value={percent} className="h-2" />

            {/* Grid of metrics */}
            <div className="grid w-fit grid-cols-2 sm:grid-cols-2 gap-4 pt-2">
                <Metric
                    icon={<Gauge className="text-blue-500" />}
                    label="Speed"
                    value={`${current.speed} km/h`}
                />

                {/* Heading */}
                <Metric
                    icon={<Compass className="text-green-500 " />}
                    label="Heading"
                    value={`${current.heading}°`}
                />

                {/* Distance */}
                <Metric
                    icon={<MapPin className="text-purple-500" />}
                    label="Distance"
                    value={`${travelled.toFixed(2)} km`}
                />

                {/* Altitude */}
                <Metric
                    icon={<ArrowUp className="text-amber-500" />}
                    label="Altitude"
                    value={`${current.altitude.toFixed(1)} m`}
                />

                {/* Signal */}
                <Metric
                    icon={<SignalHigh className="text-emerald-500" />}
                    label="Signal"
                    value={current.signal}
                />

                {/* Battery */}
                <Metric
                    icon={<Battery className="text-yellow-500" />}
                    label="Battery"
                    value={`${current.battery.toFixed(1)}%`}
                />

                {/* Charging */}
                <Metric
                    icon={<Zap className="text-cyan-500" />}
                    label="Charging"
                    value={current.charging ? "Yes ⚡" : "No"}
                />

                {/* Overspeed */}
                <Metric
                    icon={
                        <AlertTriangle
                            className={`${current.overspeed ? "text-red-500" : "text-muted-foreground"
                                }`}
                        />
                    }
                    label="Overspeed"
                    value={current.overspeed ? "Yes ⚠️" : "No"}
                />

                {/* Last updated time */}
                <Metric
                    icon={<Clock className="text-gray-500" />}
                    label="Last Update"
                    value={current.timestamp?.toLocaleTimeString() || "-"}
                />
            </div>
        </Card>
    )
}

function Metric({ icon, label, value }) {
    return (
        <div className="flex flex-col items-start gap-1">
            {/* Icon + Label */}
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>

            {/* Value below */}
            <span className="text-sm text-muted-foreground ml-7">{value}</span>
        </div>
    )
}
