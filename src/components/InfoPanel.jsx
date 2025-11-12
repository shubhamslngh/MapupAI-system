"use client";
import { useEffect } from "react";
import { useFleetStore } from "@/store/fleetStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Route,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Truck,
  Battery,
  Signal,
  Gauge,
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
    if (vehicles.length === 0) loadTrips();
  }, []);

  const selected =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const formatCoords = (lat, lng) =>
    lat && lng ? `${lat.toFixed(2)}, ${lng.toFixed(2)}` : "-";

  return (
    <div className="w-[26rem] h-full flex flex-col bg-white/70 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-sm rounded-2xl p-5 overflow-y-auto">
      <h2 className="font-semibold text-lg mb-4">Trip Information</h2>

      {/* 🚚 Active Trip Summary */}
      {selected && (
        <Card className="p-4 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 shadow-sm mb-5">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <Truck className="text-blue-500 h-5 w-5" />
              <p className="font-semibold text-sm">{selected.vehicleId}</p>
            </div>
            <Badge
              variant="outline"
              className={`capitalize border ${
                selected.status?.includes("completed")
                  ? "bg-green-100 text-green-700 border-green-200"
                  : selected.status?.includes("cancelled")
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-blue-100 text-blue-700 border-blue-200"
              }`}>
              {selected.status?.replaceAll("_", " ")}
            </Badge>
          </div>

          <p className="text-xs text-gray-500">
            Trip ID: <span className="font-medium">{selected.tripName}</span>
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600 mb-2">
            <div className="flex flex-col items-center">
              <Gauge className="h-4 w-4 text-blue-600 mb-1" />
              <p>{selected.speed?.toFixed(1) || 0} km/h</p>
              <span className="text-[10px] text-gray-400">Speed</span>
            </div>
            <div className="flex flex-col items-center">
              <Battery className="h-4 w-4 text-emerald-500 mb-1" />
              <p>{selected.battery?.toFixed(0) || 0}%</p>
              <span className="text-[10px] text-gray-400">Battery</span>
            </div>
            <div className="flex flex-col items-center">
              <Signal className="h-4 w-4 text-orange-500 mb-1" />
              <p>{selected.signal || "N/A"}</p>
              <span className="text-[10px] text-gray-400">Signal</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-600 mt-3">
            <p>Distance: {selected.distance?.toFixed(2) || 0} km</p>
            <p>
              Position:{" "}
              <span className="font-medium">
                {formatCoords(selected.lat, selected.lng)}
              </span>
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            className="mt-4 w-full shadow-sm"
            onClick={togglePlay}>
            {isPlaying ? "⏸ Pause Simulation" : "▶️ Resume Simulation"}
          </Button>
        </Card>
      )}

      {/* 🧭 Trip Selector */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">
          Select another trip
        </h3>
        <select
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={selectedVehicleId || ""}
          onChange={(e) => setSelectedVehicle(Number(e.target.value))}>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vehicleId} — {v.status?.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* 🗺 Fleet Trip Cards */}
      <div className="flex items-center justify-between mb-2 mt-1">
        <h2 className="font-semibold text-md">Fleet Trips</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedVehicle(null)}>
          👁 View All
        </Button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
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
              className={`p-3 cursor-pointer transition-all duration-300 rounded-lg ${
                isActive
                  ? "border-2 border-blue-500 bg-blue-50/80 shadow-md"
                  : "border border-gray-200 hover:bg-gray-50"
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck
                    className={`h-4 w-4 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-medium text-sm ${
                      isActive ? "text-blue-700" : "text-gray-700"
                    }`}>
                    {v.vehicleId}
                  </p>
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
