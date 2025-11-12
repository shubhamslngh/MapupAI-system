"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from "react-leaflet"
import L from "leaflet"
import { useEffect, useRef, useState } from "react"
import { useFleetStore } from "@/store/fleetStore"
import { Button } from "@/components/ui/button"
import React from "react"

// 📍 Truck icon setup (your original but resized properly)
const truckIcon = new L.Icon({
    iconUrl: "/truck-icon.png",
    iconSize: [30, 30], // ✅ smaller, proportional
    iconAnchor: [10, 10], // center align
})

const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f97316", // orange
    "#ef4444", // red
    "#8b5cf6", // purple
    "#14b8a6", // teal
    "#f59e0b", // amber
]

// 👁 smooth fly to focused truck
function FlyToVehicle({ vehicle }) {
    const map = useMap()
    const lastVehicleRef = useRef(null)

    useEffect(() => {
        if (vehicle && vehicle.lat && vehicle.lng && lastVehicleRef.current !== vehicle.id) {
            map.flyTo([vehicle.lat, vehicle.lng], 6, { duration: 1.2 })
            lastVehicleRef.current = vehicle.id
        }
    }, [vehicle])

    return null
}

export default function MapView() {
    const { vehicles, loadTrips, selectedVehicleId, setSelectedVehicle, pulseVehicleId } = useFleetStore()
    const [viewAll, setViewAll] = useState(!selectedVehicleId)

    useEffect(() => {
        loadTrips()
    }, [])

    const visibleVehicles =
        viewAll || !selectedVehicleId
            ? vehicles
            : vehicles.filter((v) => v.id === selectedVehicleId)

    const activeVehicle = selectedVehicleId
        ? vehicles.find((v) => v.id === selectedVehicleId)
        : null

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[37.0902, -95.7129]}
                zoom={4}
                className="h-full w-full z-0"
                scrollWheelZoom
                dragging
                doubleClickZoom
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />

                {/* 🚛 Vehicles */}
                {visibleVehicles.map((v, idx) => {
                    const color = COLORS[idx % COLORS.length]
                    const isPulsing = pulseVehicleId === v.vehicleId

                    return (
                        <React.Fragment key={`vehicle-${v.id}`}>
                            {/* 💡 Pulse ring */}
                            {isPulsing && (
                                <CircleMarker
                                    center={[v.lat, v.lng]}
                                    radius={15}
                                    color="rgba(0, 204, 255, 0.7)"
                                    fillColor="rgba(0, 204, 255, 0.3)"
                                    fillOpacity={0.4}
                                    className="animate-ping-soft"
                                />
                            )}

                            <Marker
                                position={[v.lat, v.lng]}
                                icon={truckIcon}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedVehicle(v.id)
                                        setViewAll(false)
                                    },
                                }}
                            >
                                <Popup>
                                    <strong>{v.vehicleId}</strong>
                                    <br />
                                    Status: {v.status}
                                    <br />
                                    Speed: {v.speed?.toFixed(1)} km/h
                                    <br />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => {
                                            setSelectedVehicle(v.id)
                                            setViewAll(false)
                                        }}
                                    >
                                        Focus
                                    </Button>
                                </Popup>
                            </Marker>

                            <Polyline
                                positions={v.path}
                                color={color}
                                weight={viewAll ? 3 : 4}
                                opacity={viewAll ? 0.7 : 1}
                            />
                        </React.Fragment>
                    )
                })}

                {activeVehicle && !viewAll && <FlyToVehicle vehicle={activeVehicle} />}
            </MapContainer>

            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setViewAll((prev) => !prev)}
                >
                    {viewAll ? "🚚 Focus Selected" : "👁 View All"}
                </Button>

                {viewAll && vehicles.length > 0 && (
                    <div className="p-3 rounded-md bg-background/90 backdrop-blur-md shadow-md text-sm w-52 border">
                        <h4 className="font-semibold mb-1">Fleet Routes</h4>
                        <div className="space-y-1">
                            {vehicles.map((v, i) => (
                                <div key={v.id} className="flex items-center gap-2">
                                    <span
                                        className="inline-block w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                    ></span>
                                    <span className="truncate">{v.vehicleId}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
