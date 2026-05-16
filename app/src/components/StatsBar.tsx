import { DANGER_CONFIG, type DangerLevel } from "../constants"
import type { DetectionItem } from "../lib/types"

interface StatsBarProps {
    detections: DetectionItem[]
}

export default function StatsBar({ detections }: StatsBarProps) {
    const counts = detections.reduce<Record<DangerLevel, number>>(
        (acc, d) => { acc[d.danger_level] = (acc[d.danger_level] ?? 0) + 1; return acc },
        { DANGER: 0, ATTENTION: 0, PROCHE: 0, OK: 0 }
    )

    const stats: { level: DangerLevel; icon: string }[] = [
        { level: "DANGER",    icon: "⚠️"  },
        { level: "ATTENTION", icon: "🔶" },
        { level: "PROCHE",    icon: "🔵" },
        { level: "OK",        icon: "✅"  },
    ]

    return (
        <div className="row g-2 mb-4">

            {/* Total */}
            <div className="col-6 col-md-3">
                <div
                    className="stat-card"
                    style={{
                        background:  "#FFFFFF",
                        borderColor: "#E4E7EC",
                        color:       "#344054",
                    }}
                >
                    <div style={{ fontSize: "0.7rem", marginBottom: "0.4rem" }}>🎯</div>
                    <div className="stat-number" style={{ color: "#101828" }}>
                        {detections.length}
                    </div>
                    <div className="stat-label" style={{ color: "#667085" }}>Total</div>
                </div>
            </div>

            {/* Par niveau */}
            {stats.map(({ level, icon }) => {
                const config = DANGER_CONFIG[level]
                const count  = counts[level]
                return (
                    <div className="col-6 col-md-3" key={level}>
                        <div
                            className="stat-card"
                            style={{
                                background:  config.bg,
                                borderColor: config.border,
                                color:       config.color,
                            }}
                        >
                            <div style={{ fontSize: "0.7rem", marginBottom: "0.4rem" }}>{icon}</div>
                            <div className="stat-number" style={{ color: config.color }}>
                                {count}
                            </div>
                            <div className="stat-label" style={{ color: config.color }}>
                                {config.label}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
