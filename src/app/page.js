"use client";

import dynamic from "next/dynamic";
import SidebarNav from "@/components/SidebarNav";
import HeaderBar from "@/components/HeaderBar";
import InfoPanel from "@/components/InfoPanel";
import MetricsPanel from "@/components/MetricsPanel";
import { useFleetStore } from "@/store/fleetStore";
import AlertsPanel from "@/components/AlertsPanel";


const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Loading map...
    </div>
  ),
});

export default function DashboardPage() {
  const { infoPanelOpen, settingsPanelOpen, alertPanelOpen } = useFleetStore();

  // Only one panel visible at a time (Info OR Metrics)
  const activePanel = infoPanelOpen
    ? "info"
    : settingsPanelOpen
      ? "settings"
      : alertPanelOpen
        ? "alert"
        : null;

  return (
    <div className="flex h-screen bg-[#f6f7fb] text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <SidebarNav />

      <div className="flex-1 flex flex-col relative">
        <HeaderBar />

        <div className="flex flex-1 relative overflow-hidden p-4">
          {/* ---------- Left Panel (Shared Slot for Info or Metrics) ---------- */}
          <div
            className={`absolute lg:static z-40 top-0 left-0 h-full bg-white rounded-2xl shadow-lg transition-all duration-500 ${activePanel ? "translate-x-0 w-fit" : "-translate-x-full w-0"
              }`}
          >
            {activePanel === "info" && (
              <div className="h-full overflow-y-auto p-4">
                <InfoPanel />
              </div>
            )}
            {activePanel === "settings" && (
              <div className="h-full overflow-y-auto p-4">
                <MetricsPanel />
              </div>
            )}
            {activePanel === "alert" && (
              <div className="h-full overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Fleet Alerts</h2>
                </div>
                <AlertsPanel />
              </div>
            )}
          </div>

          {/* ---------- Map Section ---------- */}
          <div
            className={`flex-1 bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-500 ml-2.5`}
          >
            <MapView />
          </div>
        </div>
      </div>

    </div>
  );
}
