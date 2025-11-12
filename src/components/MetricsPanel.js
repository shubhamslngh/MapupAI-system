import { useFleetStore } from "@/store/fleetStore"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import VehicleMetrics from "@/components/VehicleMetrics"
import FleetCharts from "@/components/FleetCharts"
import AlertsPanel from "@/components/AlertsPanel"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, PlayCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
export default function MetricsPanel() {
    const {
        vehicles,
        advanceSimulation,
        isPlaying,
        togglePlay,
        playbackSpeed,
        setSpeed,
        fleetStats,
        fastMode,
        setFastMode,
    } = useFleetStore()

  
    const avgSpeed =
        vehicles.length > 0
            ? vehicles.reduce((sum, v) => sum + (v.speed || 0), 0) / vehicles.length
            : 0

    return (
        <div className="w-104 h-full flex flex-col bg-white/70 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-sm rounded-2xl p-5 overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">Fleet Overview</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <SummaryCard icon={<PlayCircle />} label="Started" count={fleetStats.started} color="text-blue-500" />
                <SummaryCard icon={<CheckCircle2 />} label="Completed" count={fleetStats.completed} color="text-green-500" />
                <SummaryCard icon={<XCircle />} label="Cancelled" count={fleetStats.cancelled} color="text-red-500" />
            </div>

            <p className="text-sm mb-1">Average Speed: {avgSpeed.toFixed(1)} km/h</p>

            {/* Controls */}
            <div className="mt-3 space-y-4">
                <Button onClick={togglePlay} variant="default" className="w-full shadow-sm">
                    {isPlaying ? "Pause Simulation" : "Play Simulation"}
                </Button>

                <div>
                    <p className="text-sm text-muted-foreground mb-1">Playback Speed</p>
                    <Slider min={1} max={10} step={1} value={[playbackSpeed]} onValueChange={(v) => setSpeed(v[0])} />
                    <p className="text-xs mt-1 text-right">{playbackSpeed}x</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">Fast Mode</p>
                    <Switch checked={fastMode} onCheckedChange={setFastMode} />
                </div>
            </div>

            {/* <VehicleMetrics /> */}

            <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Alerts</h3>
                <AlertsPanel />
            </div>
        </div>

    )
}

function SummaryCard({ icon, label, count, color }) {
    return (
        <Card className="p-3 flex flex-col items-center justify-center gap-2">
            <div className={`${color}`}>{icon}</div>
            <span className="text-sm font-medium">{label}</span>
            <span className="text-lg font-bold">{count}</span>
        </Card>
    )
}
