import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "MapUp Fleet Dashboard",
  description: "Real-time Fleet Tracking Dashboard",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className="
          h-screen w-screen overflow-hidden 
          bg-background text-foreground 
          flex flex-col
        "
      >
        {/* Full-viewport container */}
        <div className="flex-1 flex flex-col h-full w-full">
          {children}
        </div>

        {/* 🔔 Global Sonner toaster for live fleet alerts */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4500}
          toastOptions={{
            style: {
              fontSize: "0.9rem",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  )
}
