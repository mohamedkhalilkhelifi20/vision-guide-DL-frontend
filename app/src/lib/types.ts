import type { DangerLevel, Lang } from "../constants"

// ── DETECTION ─────────────────────────────────────────────────────────────────

export interface DetectionItem {
    label:           string       // label YOLO brut        (ex: "person")
    label_refined:   string       // label affiné par CNN   (ex: "enfant")
    label_fr:        string       // traduction             (ex: "enfant")
    confidence:      number       // confiance YOLO 0→1     (ex: 0.92)
    distance_meters: number       // distance en mètres     (ex: 1.4)
    danger_level:    DangerLevel  // DANGER / ATTENTION / PROCHE / OK
    voice_message:   string       // message vocal complet
    detected_at:     string       // timestamp ISO
}

export interface DetectResponse {
    success:    boolean
    count:      number
    detections: DetectionItem[]
    message?:   string           // optionnel — "Aucun objet détecté"
    error?:     string           // optionnel — message d'erreur backend
}

// ── ÉTAT DE L'APPLICATION ─────────────────────────────────────────────────────

export type AppStatus =
    | "idle"        // état initial — aucune image uploadée
    | "uploading"   // image en cours d'envoi au backend
    | "success"     // résultats reçus et affichés
    | "error"       // erreur réseau ou backend

export interface AppState {
    status:     AppStatus
    imageUrl:   string | null       // URL locale pour prévisualisation
    response:   DetectResponse | null
    errorMsg:   string | null
    lang:       Lang
}

// ── UPLOAD ────────────────────────────────────────────────────────────────────

export interface UploadError {
    type:    "size" | "format" | "network" | "server"
    message: string
}
