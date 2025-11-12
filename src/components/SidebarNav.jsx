"use client";

import { useFleetStore } from "@/store/fleetStore";
import { PanelLeft, Map, Settings, Bell } from "lucide-react";

export default function SidebarNav() {
  const {
    toggleInfoPanel,
    toggleSettingsPanel,
    toggleAlertPanel,
    closeAllPanels,
  } = useFleetStore();

  const items = [
    {
      icon: <PanelLeft size={22} />,
      label: "Info",
      onClick: toggleInfoPanel,
    },
    {
      icon: <Map size={22} />,
      label: "Map",
      onClick: closeAllPanels,
    },
    {
      icon: <Bell size={22} />,
      label: "Alerts",
      onClick: toggleAlertPanel,
    },
    {
      icon: <Settings size={22} />,
      label: "Settings",
      onClick: toggleSettingsPanel,
    },
  ];

  return (
    <aside
      className="
        bg-black text-white flex
        lg:flex-col lg:w-20 lg:h-full
        w-full h-16
        items-center justify-evenly lg:justify-start
        py-2 lg:py-6
        lg:rounded-r-3xl rounded-t-3xl
        shadow-md
        fixed bottom-0 left-0 lg:static
        z-50
      ">
      <div
        className="
          flex lg:flex-col gap-6 lg:gap-8
          w-full justify-around lg:justify-start
        ">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="
              p-3 rounded-xl hover:bg-white/10 transition-all
              flex items-center justify-center
              w-full lg:w-auto
            "
            title={item.label}>
            {item.icon}
          </button>
        ))}
      </div>
    </aside>
  );
}
