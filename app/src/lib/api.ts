import { API_DETECT_ENDPOINT, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "../constants"
import type { Lang } from "../constants"
import type { DetectResponse, UploadError } from "./types"

// ── VALIDATION LOCALE (avant envoi) ──────────────────────────────────────────

export function validateImage(file: File): UploadError | null {
    // Typer ACCEPTED_IMAGE_TYPES comme string[] pour éviter le cast any
    const accepted: string[] = [...ACCEPTED_IMAGE_TYPES]

    if (!accepted.includes(file.type)) {
        return {
            type: "format",
            message: `Format non supporté : ${file.type}. Utilise JPG ou PNG.`,
        }
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            type: "size",
            message: `Image trop grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum : 10 MB.`,
        }
    }

    return null
}

// ── APPEL API PRINCIPAL ───────────────────────────────────────────────────────

export async function detectObjects(
    file: File,
    lang: Lang
): Promise<DetectResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const url = `${API_DETECT_ENDPOINT}?lang=${lang}`

    let response: Response

    try {
        response = await fetch(url, {
            method: "POST",
            body: formData,
        })
    } catch {
        // Erreur réseau — backend inaccessible
        throw {
            type: "network",
            message: "Impossible de contacter le serveur. Vérifier que le backend est lancé sur localhost:8000.",
        } satisfies UploadError
    }

    // Erreur HTTP (4xx, 5xx)
    if (!response.ok) {
        let detail = `Erreur serveur (${response.status})`
        try {
            const json = await response.json() as { detail?: string }
            if (json.detail) detail = json.detail
        } catch {
            // réponse non-JSON — on garde le message générique
        }

        throw {
            type: "server",
            message: detail,
        } satisfies UploadError
    }

    const data: DetectResponse = await response.json() as DetectResponse
    return data
}
