// ── API ───────────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
export const API_DETECT_ENDPOINT = `${API_BASE_URL}/api/detect`

// ── LANGUES ───────────────────────────────────────────────────────────────────
export const LANGUAGES = [
    { value: "fr", label: "Français" },
    { value: "tn", label: "Tunisien (تونسي)" },
] as const

export type Lang = "fr" | "tn"

// ── NIVEAUX DE DANGER ─────────────────────────────────────────────────────────
export const DANGER_CONFIG = {
    DANGER: {
        label: "DANGER",
        color: "#DC2626",       // rouge vif
        bg: "#FEF2F2",
        border: "#FECACA",
        dot: "#DC2626",
        priority: 0,
    },
    ATTENTION: {
        label: "ATTENTION",
        color: "#D97706",       // orange
        bg: "#FFFBEB",
        border: "#FDE68A",
        dot: "#D97706",
        priority: 1,
    },
    PROCHE: {
        label: "PROCHE",
        color: "#2563EB",       // bleu
        bg: "#EFF6FF",
        border: "#BFDBFE",
        dot: "#2563EB",
        priority: 2,
    },
    OK: {
        label: "OK",
        color: "#16A34A",       // vert
        bg: "#F0FDF4",
        border: "#BBF7D0",
        dot: "#16A34A",
        priority: 3,
    },
} as const

export type DangerLevel = keyof typeof DANGER_CONFIG

// ── UPLOAD ────────────────────────────────────────────────────────────────────
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]
export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
