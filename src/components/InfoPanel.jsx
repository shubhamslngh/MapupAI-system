"use client";
import { useEffect } from "react";
import { useFleetStore } from "@/store/fleetStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VehicleMetrics from "@/components/VehicleMetrics";
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
    if (vehicles.length === 0) loadTrips();
  }, []);

  const selected =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const formatCoords = (lat, lng) =>
    lat && lng ? `${lat.toFixed(2)}, ${lng.toFixed(2)}` : "-";

  return (
    <div className="w-full h-full flex flex-col bg-white/70 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-sm rounded-2xl p-5 overflow-y-auto">
      <h2 className="font-semibold text-lg mb-4">Trip Information</h2>

      {/* 🚚 Active Trip Overview */}
      {selected && (
        <div className="shrink-0">
          <VehicleMetrics />
        </div>
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

      {/* 🗺 Fleet Trip List */}
      <div className="flex flex-col gap-3 overflow-y-visible pb-4">
        <h2 className="font-semibold text-md">Fleet Trips</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedVehicle(null)}>
          👁 View All
        </Button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-visible pb-4">
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
