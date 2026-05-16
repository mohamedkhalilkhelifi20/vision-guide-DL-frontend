import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title:       "Object-Finder — Pipeline YOLO + CNN",
    description: "Système de détection et classification d'objets pour personnes malvoyantes",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
        <body>
        <div className="page-wrapper">
            {children}
        </div>
        </body>
        </html>
    )
}
