🚚 MapUp Fleet Tracking Dashboard

A real-time fleet tracking simulation dashboard built with Next.js, Tailwind CSS, ShadCN/UI, and Zustand for state management.
This project visualizes vehicle trips and events across multiple routes, simulating real-world fleet tracking behavior with animated updates, alerts, and metrics.

📸 Demo Preview

🧭 Features

🗺 Real-time Map Simulation

Displays multiple vehicle routes simultaneously.

Vehicles move smoothly across the map based on timestamped events.

Map auto-focuses when a trip or alert is selected.

📈 Fleet Insights

Trip summary (Started / Completed / Cancelled).

Vehicle performance metrics (speed, distance, battery).

Fleet-wide stats updated live.

⚡ Event Alerts

Real-time Sonner toasts for critical events (battery low, signal lost, etc.).

Dedicated alerts panel to view recent alerts.

Clicking an alert highlights the related vehicle on the map.

🎛 Control Panel

Play / Pause simulation.

Adjustable playback speed (1x–10x).

Fast Mode (skips repetitive location pings for smoother playback).

📱 Responsive Layout

Left-side panel (desktop) becomes bottom dock (mobile).

Collapsible Info, Metrics, and Alert panels.

Fully optimized for both large and small screens.

🧰 Tech Stack
Category	Technology
Framework	Next.js 14

Styling	Tailwind CSS
, ShadCN UI

Map	Leaflet

State Management	Zustand

Notifications	Sonner

Icons	Lucide Icons
⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/fleet-tracking-dashboard.git
cd fleet-tracking-dashboard

2️⃣ Install dependencies
npm install


or

yarn install

3️⃣ Generate or add trip data

The simulator uses JSON datasets representing fleet trips.

If you generated your own data using the HOW_TO_GENERATE_DATA.md guide,
place the files in the public/data/ folder:

public/data/
├── trip_cross_country.json
├── trip_urban_dense.json
├── trip_mountain_cancelled.json
├── trip_southern_issues.json
└── trip_regional_logistics.json


Each file should contain a structured array of tracking events like:

{
  "event_id": "evt_001",
  "event_type": "trip_started",
  "timestamp": "2025-11-03T10:00:00.000Z",
  "vehicle_id": "VH_123",
  "trip_id": "trip_20251103_100000",
  "location": { "lat": 37.7749, "lng": -122.4194 },
  "planned_distance_km": 142.5,
  "estimated_duration_hours": 4.5
}

🚀 Run the Development Server
npm run dev


Then open your browser to:

👉 http://localhost:3000

🧩 How the Simulation Works

The dashboard reads event data for each vehicle and processes it in real-time, based on a simulation loop.

The loop runs continuously in the background using requestAnimationFrame().

Every event is processed chronologically.

The playbackSpeed slider controls how many events advance per second.

The Fast Mode option skips frequent “location_ping” events for smoother playback.

Simulation Controls:
Control	Description
▶️ Play / Pause	Start or stop live simulation
⚡ Fast Mode	Skip frequent updates for smooth performance
🕒 Playback Speed	Adjust speed (1x–10x)
🚨 Alerts	View or filter triggered fleet alerts
🧠 Event Types Processed

The system supports 15 event types across different categories:

Category	Events
Trip Lifecycle	trip_started, trip_completed, trip_cancelled
Location & Movement	location_ping, signal_lost, signal_recovered
Vehicle State	vehicle_stopped, vehicle_moving, speed_violation
Telemetry	vehicle_telemetry, device_error
System Warnings	battery_low
Fuel Events	fuel_level_low, refueling_started, refueling_completed
🧭 Folder Structure
fleet-tracking-dashboard/
├── public/
│   ├── data/               # Trip event datasets
│   ├── truck-icon.png      # Vehicle map icon
│   └── demo-preview.png
├── src/
│   ├── components/
│   │   ├── MapView.jsx
│   │   ├── MetricsPanel.jsx
│   │   ├── AlertsPanel.jsx
│   │   ├── FleetSidebar.jsx
│   │   ├── HeaderBar.jsx
│   │   ├── SidebarNav.jsx
│   │   └── InfoPanel.jsx
│   ├── store/
│   │   └── fleetStore.js   # Zustand store (main simulation logic)
│   └── app/
│       └── page.jsx        # Main Dashboard
├── package.json
└── README.md

🌐 Deployment

You can deploy this dashboard easily on Vercel:

npm run build
npm run start


Then connect the repo to your Vercel Dashboard
.
All assets (data, icons, Leaflet tiles) are served statically.

🧑‍💻 Developed By

Shubham Singh
Fleet Tracking Dashboard for MapUp Assessment
Built with ❤️ using Next.js + Tailwind + ShadCN + Zustand