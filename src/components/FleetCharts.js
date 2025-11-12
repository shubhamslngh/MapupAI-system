"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFleetStore } from "@/store/fleetStore";

export default function FleetCharts() {
  const { vehicles } = useFleetStore();

  // Count event types across all vehicles
  const eventCounts = {};
  vehicles.forEach((v) => {
    v.events.forEach((e) => {
      eventCounts[e.type] = (eventCounts[e.type] || 0) + 1;
    });
  });

  const data = Object.entries(eventCounts).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="w-full h-64 mt-6">
      <h3 className="font-semibold mb-2">Event Type Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
