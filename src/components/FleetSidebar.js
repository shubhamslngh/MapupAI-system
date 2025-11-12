"use client";
import { useEffect } from "react";
import { useFleetStore } from "@/store/fleetStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Route,
    PlayCircle,
    CheckCircle2,
    XCircle,
    Truck,
} from "lucide-react";

export default function InfoPanel() {
    const {
        vehicles,
        loadTrips,
        selectedVehicleId,
        setSelectedVehicle,
        togglePlay,
        isPlaying,
    } = useFleetStore();

    useEffect(() => {
        loadTrips();
    }, []);

    const selected =
        vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

    const formatCoords = (lat, lng) =>
        lat && lng ? `${lat.toFixed(2)}, ${lng.toFixed(2)}` : "-";

    return (
        <div className="flex flex-col gap-4">
            {/* 🚚 Active trip selector */}
            <div className="bg-linear-to-r from-purple-200 to-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-2">
                    Select active trip
                </h3>
                <select
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={selectedVehicleId || ""}
                    onChange={(e) => setSelectedVehicle(Number(e.target.value))}
                >
                    {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.vehicleId} — {v.status?.replaceAll("_", " ")}
                        </option>
                    ))}
                </select>
            </div>

            {/* 📦 Selected vehicle details */}
            {selected && (
                <div className="bg-linear-to-r from-indigo-200 to-pink-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Trip ID</p>
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-sm">{selected.tripName}</p>
                        <span
                            className={`px-2 py-1 text-xs rounded-md ${selected.status?.includes("completed")
                                    ? "bg-green-100 text-green-700"
                                    : selected.status?.includes("cancelled")
                                        ? "bg-red-100 text-red-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                        >
                            {selected.status?.replaceAll("_", " ")}
                        </span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 mb-3">
                        <div>
                            <p>Speed</p>
                            <p className="font-medium text-gray-800">
                                {selected.speed?.toFixed(1)} km/h
                            </p>
                        </div>
                        <div>
                            <p>Battery</p>
                            <p className="font-medium text-gray-800">
                                {selected.battery?.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-700">
                        <div>
                            <p>Signal</p>
                            <p className="font-medium">{selected.signal}</p>
                        </div>
                        <div>
                            <p>Distance</p>
                            <p className="font-medium">
                                {selected.distance?.toFixed(2)} km
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={togglePlay}
                    >
                        {isPlaying ? "⏸ Pause Simulation" : "▶️ Resume Simulation"}
                    </Button>
                </div>
            )}

            {/* 🗺 Fleet list (merged FleetSidebar content) */}
            <div className="flex items-center justify-between mb-2 mt-1">
                <h2 className="font-semibold text-md">Fleet Trips</h2>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVehicle(null)}
                >
                    👁 View All
                </Button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[40vh]">
                {vehicles.length === 0 && (
                    <p className="text-sm text-muted-foreground">Loading trips...</p>
                )}

                {vehicles.map((v) => {
                    const isActive = selectedVehicleId === v.id;
                    const start = v.path?.[0];
                    const end = v.path?.[v.path.length - 1];
                    const tripStatus = v.status?.includes("completed")
                        ? "completed"
                        : v.status?.includes("cancelled")
                            ? "cancelled"
                            : "active";

                    return (
                        <Card
                            key={v.id}
                            onClick={() => setSelectedVehicle(v.id)}
                            className={`p-3 cursor-pointer transition-all hover:scale-98 hover:bg-muted/70 ${isActive
                                    ? "border-blue-500 ring-blue-300"
                                    : "border border-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Truck className="text-blue-500 h-4 w-4" />
                                    <p className="font-medium text-sm">{v.vehicleId}</p>
                                </div>
                                {tripStatus === "completed" ? (
                                    <CheckCircle2 className="text-green-500 h-4 w-4" />
                                ) : tripStatus === "cancelled" ? (
                                    <XCircle className="text-red-500 h-4 w-4" />
                                ) : (
                                    <PlayCircle className="text-blue-500 h-4 w-4" />
                                )}
                            </div>

                            <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-emerald-500" />
                                    <span>Start: {formatCoords(start?.[0], start?.[1])}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Route className="h-3 w-3 text-orange-500" />
                                    <span>Dest: {formatCoords(end?.[0], end?.[1])}</span>
                                </div>
                            </div>

                            <p className="text-xs mt-2 text-muted-foreground">
                                {v.status?.replaceAll("_", " ")} •{" "}
                                {v.speed ? `${v.speed.toFixed(1)} km/h` : "0 km/h"}
                            </p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
