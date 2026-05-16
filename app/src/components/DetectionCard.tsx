import { DANGER_CONFIG } from "../constants"
import type { DetectionItem } from "../lib/types"
import DangerBadge from "./DangerBadge"

interface DetectionCardProps {
    detection: DetectionItem
    index:     number
}

export default function DetectionCard({ detection, index }: DetectionCardProps) {
    const config        = DANGER_CONFIG[detection.danger_level]
    const confidencePct = Math.round(detection.confidence * 100)
    const confidenceColor =
        confidencePct >= 85 ? "#16A34A" :
            confidencePct >= 65 ? "#D97706" : "#DC2626"

    const hasCnnRefinement = detection.label_refined !== detection.label

    return (
        <div className="detection-card">

            {/* Barre colorée en haut */}
            <div
                className="card-accent"
                style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}99)` }}
            />

            <div className="card-body-inner">

                {/* Header — index + badge */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="card-index">#{String(index + 1).padStart(2, "0")}</span>
                    <DangerBadge level={detection.danger_level} size="sm" />
                </div>

                {/* Label principal */}
                <div className="card-label mb-1">{detection.label_fr}</div>

                {/* YOLO label brut */}
                {hasCnnRefinement && (
                    <div className="mb-2" style={{ fontSize: "0.7rem", color: "#667085" }}>
                        YOLO: <code style={{ fontSize: "0.68rem", background: "#F2F4F7", padding: "1px 4px", borderRadius: "4px" }}>{detection.label}</code>
                    </div>
                )}

                {/* Tag CNN */}
                {hasCnnRefinement && (
                    <div className="mb-2">
            <span className="cnn-tag">
              🧠 CNN → {detection.label_refined}
            </span>
                    </div>
                )}

                <hr style={{ borderColor: "#F2F4F7", margin: "0.75rem 0" }} />

                {/* Métriques */}
                <div className="row g-2 mb-2">

                    {/* Distance */}
                    <div className="col-6">
                        <div className="metric-label">Distance</div>
                        <div className="metric-value" style={{ color: config.color }}>
                            {detection.distance_meters}
                            <span className="metric-unit">m</span>
                        </div>
                    </div>

                    {/* Confiance */}
                    <div className="col-6">
                        <div className="metric-label">Confiance</div>
                        <div className="metric-value" style={{ color: confidenceColor }}>
                            {confidencePct}
                            <span className="metric-unit">%</span>
                        </div>
                        <div className="confidence-bar-track">
                            <div
                                className="confidence-bar-fill"
                                style={{ width: `${confidencePct}%`, background: confidenceColor }}
                            />
                        </div>
                    </div>
                </div>

                {/* Message vocal */}
                <div
                    className="voice-box"
                    style={{
                        background:   config.bg,
                        borderColor:  config.border,
                        color:        config.color,
                    }}
                >
                    🔊 {detection.voice_message}
                </div>

            </div>
        </div>
    )
}
