import { create } from "zustand"
import { toast } from "sonner"

export const useFleetStore = create((set, get) => ({
    vehicles: [],
    playbackSpeed: 1,
    isPlaying: false,
    selectedVehicleId: null,
    setSelectedVehicle: (id) => set({ selectedVehicleId: id }),
    fleetStats: { started: 0, completed: 0, cancelled: 0 },
    alerts: [],
    triggeredEvents: new Set(),
    isLoaded: false,
    fastMode: false,
    setFastMode: (value) => set({ fastMode: value }),
    infoPanelOpen: false,
    settingsPanelOpen: false,
    alertPanelOpen: false,
    toggleAlertPanel: () =>
        set((state) => ({
            alertPanelOpen: !state.alertPanelOpen,
            infoPanelOpen: false,
            settingsPanelOpen: false,
        })),
    toggleInfoPanel: () =>
        set((state) => ({
            infoPanelOpen: !state.infoPanelOpen,
            settingsPanelOpen: false,
            alertPanelOpen: false,
        })),

    toggleSettingsPanel: () =>
        set((state) => ({
            settingsPanelOpen: !state.settingsPanelOpen,
            infoPanelOpen: false,
            alertPanelOpen: false,
        })),

    closeAllPanels: () => set({ infoPanelOpen: false, settingsPanelOpen: false, alertPanelOpen: false }),

    setPulseVehicle: null,
    setPulseVehicle: (id) => set({ pulseVehicleId: id }),

    // 🚚 Load all trips
    loadTrips: async () => {
        const files = [
            "trip_cross_country.json",
            "trip_urban_dense.json",
            "trip_mountain_cancelled.json",
            "trip_southern_issues.json",
            "trip_regional_logistics.json",
        ]
        const trips = await Promise.all(files.map((f) => fetch(`/data/${f}`).then((r) => r.json())))

        const vehicles = trips.map((trip, index) => {
            const events = trip.map((e) => ({
                id: e.event_id,
                type: e.event_type,
                timestamp: new Date(e.timestamp),
                lat: e.location?.lat || 0,
                lng: e.location?.lng || 0,
                speed: e.movement?.speed_kmh || 0,
                heading: e.movement?.heading_degrees || 0,
                altitude: e.location?.altitude_meters || 0,
                distance: e.distance_travelled_km || e.total_distance_km || 0,
                signal: e.signal_quality || "unknown",
                battery: e.device?.battery_level || 0,
                charging: e.device?.charging || false,
                overspeed: e.overspeed || false,
                extra: e,
            }))

            return {
                id: index + 1,
                vehicleId: trip[0]?.vehicle_id || `VH_${index + 1}`,
                tripName: trip[0]?.trip_id || `Trip_${index + 1}`,
                events,
                path: events.map((e) => [e.lat, e.lng]),
                lat: events[0]?.lat,
                lng: events[0]?.lng,
                speed: events[0]?.speed,
                status: events[0]?.type,
                index: 0,
            }
        })

        set({ vehicles, triggeredEvents: new Set() })

        setTimeout(() => {
            console.log("✅ Fleet data ready, starting simulation...")
        }, 1500)
    },

    // 🚨 Alerts and notifications
    pushAlert: (type, message, time, eventId) => {
        const { alerts, triggeredEvents } = get()
        if (triggeredEvents.has(eventId)) return

        triggeredEvents.add(eventId)

        const newAlert = { type, title: message, time, id: eventId }
        set({ alerts: [...alerts, newAlert], triggeredEvents })

        switch (type) {
            case "success":
                toast.success(message)
                break
            case "error":
                toast.error(message)
                break
            case "warning":
                toast.warning(message)
                break
            default:
                toast(message)
                break
        }
    },

    focusVehicle: (vehicleCode) => {
        const { vehicles, setSelectedVehicle, setPulseVehicle, toggleInfoPanel, infoPanelOpen } = get();

        const found = vehicles.find((v) => v.vehicleId === vehicleCode);
        if (!found) return;

        if (!infoPanelOpen) toggleInfoPanel();

        setSelectedVehicle(found.id);
        setPulseVehicle(found.id);

        setTimeout(() => setPulseVehicle(null), 3000);
    },


    advanceSimulation: () => {
        const { vehicles, playbackSpeed, isPlaying, fleetStats, pushAlert, fastMode } = get()
        if (!isPlaying) return

        const updatedVehicles = vehicles.map((v) => {
            const currentIndex = v.index
            const nextIndex = Math.min(currentIndex + playbackSpeed, v.events.length - 1)
            const eventsToProcess = v.events.slice(currentIndex, nextIndex + 1)

            for (const event of eventsToProcess) {
                if (!event) continue
                if (fastMode && event.type === "location_ping") continue

                switch (event.type) {
                    case "trip_started":
                        if (!v._startedNotified) {
                            fleetStats.started += 1
                            pushAlert("success", `${v.vehicleId} trip started 🚚`, event.timestamp, event.id)
                            v._startedNotified = true
                        }
                        break
                    case "trip_completed":
                        if (!v._completedNotified) {
                            fleetStats.completed += 1
                            pushAlert("success", `${v.vehicleId} trip completed 🎯`, event.timestamp, event.id)
                            v._completedNotified = true
                        }
                        break
                    case "trip_cancelled":
                        if (!v._cancelledNotified) {
                            fleetStats.cancelled += 1
                            pushAlert("error", `${v.vehicleId} trip cancelled 🚫`, event.timestamp, event.id)
                            v._cancelledNotified = true
                        }
                        break
                    case "signal_lost":
                        pushAlert("warning", `${v.vehicleId} signal lost 📡`, event.timestamp, event.id)
                        break
                    case "signal_recovered":
                        pushAlert("success", `${v.vehicleId} signal recovered ✅`, event.timestamp, event.id)
                        break
                    case "battery_low":
                        pushAlert(
                            "warning",
                            `${v.vehicleId} battery low (${event.extra?.battery_level_percent}%) 🔋`,
                            event.timestamp,
                            event.id
                        )
                        break
                    case "fuel_level_low":
                        pushAlert(
                            "warning",
                            `${v.vehicleId} fuel low (${event.extra?.fuel_level_percent}%) ⛽`,
                            event.timestamp,
                            event.id
                        )
                        break
                    case "device_error":
                        pushAlert(
                            "error",
                            `${v.vehicleId} device error: ${event.extra?.error_type} ⚙️`,
                            event.timestamp,
                            event.id
                        )
                        break
                    default:
                        break
                }

                // 🛰️ update vehicle position
                v.lat = event.lat ?? v.lat
                v.lng = event.lng ?? v.lng
                v.speed = event.speed ?? v.speed
                v.status = event.type ?? v.status
            }

            return { ...v, index: nextIndex }
        })

        set({ vehicles: updatedVehicles, fleetStats })
    },

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    setSpeed: (speed) => {
        const { fastMode, setFastMode } = get()
        if (speed > 5 && !fastMode) {
            toast.info("⚡ Fast Mode activated for smooth performance")
            setFastMode(true)
        }
        if (speed <= 5 && fastMode) {
            toast("🔍 Fast Mode turned off for detailed tracking")
            setFastMode(false)
        }
        set({ playbackSpeed: speed })
    },
}))

// 🧩 ---- GLOBAL SIMULATION LOOP ----
if (typeof window !== "undefined" && !window.__fleetSimLoop) {
    console.log("🌍 Global Fleet Simulation started")
    window.__fleetSimLoop = setInterval(() => {
        const state = useFleetStore.getState()
        if (state.isPlaying) {
            state.advanceSimulation()
        }
    }, 1000) // base interval, scaled by playbackSpeed inside advanceSimulation
}
