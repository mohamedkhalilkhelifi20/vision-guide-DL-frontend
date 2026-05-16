import { DANGER_CONFIG, type DangerLevel } from "../constants"

interface DangerBadgeProps {
    level: DangerLevel
    size?: "sm" | "md"
}

export default function DangerBadge({ level, size = "md" }: DangerBadgeProps) {
    const config = DANGER_CONFIG[level]

    const icons: Record<DangerLevel, string> = {
        DANGER:    "⚠️",
        ATTENTION: "🔶",
        PROCHE:    "🔵",
        OK:        "✅",
    }

    const padding = size === "sm" ? "0.2rem 0.55rem" : "0.35rem 0.85rem"
    const fontSize = size === "sm" ? "0.7rem" : "0.78rem"

    return (
        <span
            style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "0.35rem",
                padding,
                fontSize,
                fontWeight:    700,
                letterSpacing: "0.06em",
                borderRadius:  "999px",
                border:        `1.5px solid ${config.border}`,
                backgroundColor: config.bg,
                color:         config.color,
                whiteSpace:    "nowrap",
            }}
        >
      <span style={{ fontSize: size === "sm" ? "0.7rem" : "0.8rem" }}>
        {icons[level]}
      </span>
            {config.label}
    </span>
    )
}
