"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFleetStore } from "@/store/fleetStore";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";
import AlertsPanel from "@/components/AlertsPanel";

export default function AlertDrawer() {
  const { alertPanelOpen, toggleAlertPanel } = useFleetStore();

  return (
    <AnimatePresence>
      {alertPanelOpen && (
        <motion.div
          key="alert-drawer"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-[26rem] bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-l border-neutral-200 dark:border-neutral-700 shadow-2xl z-[9999] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Fleet Alerts</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleAlertPanel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <AlertsPanel />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
