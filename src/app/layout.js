import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "MapUp Fleet Dashboard",
  description: "Real-time Fleet Tracking Dashboard",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
        {/* 🔔 Global Sonner toaster for live fleet alerts */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4500}
        />
      </body>
    </html>
  )
}
