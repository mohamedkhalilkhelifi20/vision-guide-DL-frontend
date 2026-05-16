import type { DetectionItem } from "../lib/types"
import DetectionCard from "./DetectionCard"
import StatsBar from "./StatsBar"

interface DetectionGridProps {
    detections: DetectionItem[]
}

export default function DetectionGrid({ detections }: DetectionGridProps) {
    if (detections.length === 0) {
        return (
            <div
                className="text-center rounded-3 p-5"
                style={{ background: "#F8F9FA", border: "1.5px dashed #DEE2E6" }}
            >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
                <div style={{ fontWeight: 700, color: "#495057", marginBottom: "0.25rem" }}>
                    Aucun objet détecté
                </div>
                <div style={{ fontSize: "0.85rem", color: "#ADB5BD" }}>
                    Essaie avec une image contenant des personnes ou des escaliers.
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Résumé statistiques */}
            <StatsBar detections={detections} />

            {/* Titre section */}
            <div className="d-flex align-items-center gap-2 mb-3">
        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#212529" }}>
          Détections
        </span>
                <span
                    style={{
                        background:   "#E9ECEF",
                        borderRadius: "999px",
                        padding:      "0.1rem 0.6rem",
                        fontSize:     "0.75rem",
                        fontWeight:   700,
                        color:        "#495057",
                    }}
                >
          {detections.length}
        </span>
                <span style={{ fontSize: "0.78rem", color: "#ADB5BD", marginLeft: "auto" }}>
          Triés par niveau de danger
        </span>
            </div>

            {/* Grille de cartes */}
            <div className="row g-3">
                {detections.map((detection, index) => (
                    <div className="col-12 col-md-6 col-xl-4" key={index}>
                        <DetectionCard detection={detection} index={index} />
                    </div>
                ))}
            </div>
        </div>
    )
}
