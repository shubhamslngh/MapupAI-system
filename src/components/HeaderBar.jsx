"use client";

import { Bell, Search } from "lucide-react";
import { useFleetStore } from "@/store/fleetStore";
import { useState } from "react";

export default function HeaderBar() {
  const { toggleAlertPanel, vehicles, setSelectedVehicle } = useFleetStore();
  const [query, setQuery] = useState("");

  // Simple search filtering for vehicles or trips
  const filtered = query
    ? vehicles.filter(
        (v) =>
          v.vehicleId.toLowerCase().includes(query.toLowerCase()) ||
          v.tripName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm relative">
      {/* 🔍 Search */}
      <div className="relative w-80">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips or vehicles..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>

        {/* Search dropdown */}
        {query && (
          <div className="absolute top-10 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v.id);
                    setQuery("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                  <span className="font-medium">{v.vehicleId}</span>{" "}
                  <span className="text-gray-500">({v.tripName})</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No matches found
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔔 Bell + Profile */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative" onClick={toggleAlertPanel}>
          <Bell className="text-gray-600" size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src="/truck-icon.png"
            alt="profile"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-medium">Shubham Singh</span>
        </div>
      </div>
    </header>
  );
}
