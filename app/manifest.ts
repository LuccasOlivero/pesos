import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinanceTracker - Gestiona tus finanzas",
    short_name: "FinanceTracker",
    description: "Aplicación para gestionar tus ingresos y gastos diarios",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f8e2e2",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  }
}
