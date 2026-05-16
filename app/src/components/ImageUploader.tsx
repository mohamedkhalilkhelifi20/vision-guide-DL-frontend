"use client"

import { useRef, useState } from "react"
import { LANGUAGES, type Lang } from "../constants"
import { validateImage } from "../lib/api"
import type { UploadError } from "../lib/types"

interface ImageUploaderProps {
    onSubmit:  (file: File, lang: Lang) => void
    isLoading: boolean
    imageUrl:  string | null
}

export default function ImageUploader({ onSubmit, isLoading, imageUrl }: ImageUploaderProps) {
    const inputRef              = useRef<HTMLInputElement>(null)
    const [lang, setLang]       = useState<Lang>("fr")
    const [dragOver, setDragOver] = useState(false)
    const [localError, setLocalError] = useState<UploadError | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    function handleFile(file: File) {
        const error = validateImage(file)
        if (error) { setLocalError(error); setSelectedFile(null); return }
        setLocalError(null)
        setSelectedFile(file)
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    return (
        <div>
            {/* Sélecteur de langue */}
            <div className="mb-3">
                <label style={{ fontWeight: 700, fontSize: "0.72rem", color: "#667085", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                    Langue des messages vocaux
                </label>
                <div className="d-flex gap-2">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.value}
                            type="button"
                            onClick={() => setLang(l.value)}
                            className={`lang-btn ${lang === l.value ? "active" : ""}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Zone de drop */}
            <div
                className={`upload-zone ${dragOver ? "drag-over" : ""} ${localError ? "has-error" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                />

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Aperçu"
                        style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "10px", objectFit: "contain", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                    />
                ) : (
                    <>
                        <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>📷</div>
                        <div style={{ fontWeight: 700, color: "#344054", fontSize: "0.88rem" }}>
                            Glisser une image ici
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#667085" }}>
                            ou cliquer pour choisir · JPG / PNG · max 10 MB
                        </div>
                    </>
                )}
            </div>

            {/* Fichier sélectionné */}
            {selectedFile && (
                <div className="file-info mt-2">
                    <span>🖼️</span>
                    <span style={{ flex: 1 }}>{selectedFile.name}</span>
                    <span style={{ color: "#667085", fontWeight: 500 }}>
            {(selectedFile.size / 1024).toFixed(0)} KB
          </span>
                </div>
            )}

            {/* Erreur locale */}
            {localError && (
                <div className="error-alert mt-2">
                    ⚠️ {localError.message}
                </div>
            )}

            {/* Bouton analyser */}
            <button
                type="button"
                onClick={() => selectedFile && onSubmit(selectedFile, lang)}
                disabled={!selectedFile || isLoading}
                className="btn-analyze mt-3"
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" style={{ width: "0.9rem", height: "0.9rem" }} />
                        Analyse en cours...
                    </>
                ) : (
                    <> 🔍 Analyser l&apos;image </>
                )}
            </button>
        </div>
    )
}
