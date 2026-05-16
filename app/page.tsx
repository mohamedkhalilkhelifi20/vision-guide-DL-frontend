"use client"

import { useState } from "react"
import type { Lang } from "./src/constants"
import type { AppState } from "./src/lib/types"
import { detectObjects } from "./src/lib/api"
import ImageUploader from "./src/components/ImageUploader"
import DetectionGrid from "./src/components/DetectionGrid"

const INITIAL_STATE: AppState = {
    status: "idle", imageUrl: null, response: null, errorMsg: null, lang: "fr",
}

const PIPELINE_STEPS = [
    { icon: "🎯", name: "YOLOv8n",      desc: "Détection + localisation (80 classes COCO)" },
    { icon: "✂️", name: "Crop bbox",     desc: "Extraction de la région détectée" },
    { icon: "🧠", name: "CNN Rôle 1",    desc: "MobileNetV2 → enfant / adulte / personne âgée" },
    { icon: "🪜", name: "CNN Rôle 2",    desc: "ConvNeXt-Tiny → confirmation escaliers" },
    { icon: "📏", name: "Distance",       desc: "Estimation par formule focale" },
    { icon: "🔊", name: "Message vocal",  desc: "Alerte en français ou dialecte tunisien" },
]

export default function HomePage() {
    const [state, setState] = useState<AppState>(INITIAL_STATE)

    async function handleSubmit(file: File, lang: Lang) {
        const imageUrl = URL.createObjectURL(file)
        setState({ status: "uploading", imageUrl, response: null, errorMsg: null, lang })
        try {
            const response = await detectObjects(file, lang)
            setState(prev => ({ ...prev, status: "success", response }))
        } catch (err) {
            const msg = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Une erreur inattendue s'est produite."
            setState(prev => ({ ...prev, status: "error", errorMsg: msg }))
        }
    }

    return (
        <>
            {/* HEADER */}
            <header className="app-header">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="logo-icon">🔍</div>
                            <div>
                                <div className="logo-title">Object-Finder</div>
                                <div className="logo-subtitle">Pipeline YOLO + CNN</div>
                            </div>
                        </div>
                        <span className="badge-school d-none d-sm-inline">
              École Polytechnique de Sousse — 4ème année DS&amp;IA
            </span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="container py-4">
                <div className="row g-4">

                    {/* Colonne gauche */}
                    <div className="col-12 col-lg-4">
                        <div className="panel mb-4">
                            <div className="panel-title"><span>📷</span> Image à analyser</div>
                            <ImageUploader
                                onSubmit={handleSubmit}
                                isLoading={state.status === "uploading"}
                                imageUrl={state.imageUrl}
                            />
                        </div>

                        <div className="panel">
                            <div className="panel-title"><span>⚙️</span> Pipeline</div>
                            <div className="d-flex flex-column gap-2">
                                {PIPELINE_STEPS.map(({ icon, name, desc }) => (
                                    <div className="pipeline-step" key={name}>
                                        <div className="step-icon">{icon}</div>
                                        <div>
                                            <div className="step-name">{name}</div>
                                            <div className="step-desc">{desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="col-12 col-lg-8">
                        <div className="panel" style={{ minHeight: "520px" }}>
                            <div className="panel-title"><span>📊</span> Résultats de détection</div>

                            {/* Idle */}
                            {state.status === "idle" && (
                                <div className="empty-state">
                                    <div className="empty-icon">🖼️</div>
                                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#344054", marginBottom: "0.4rem" }}>
                                        Aucune image analysée
                                    </div>
                                    <div style={{ fontSize: "0.82rem", color: "#667085", maxWidth: "280px" }}>
                                        Chargez une image à gauche pour démarrer la détection YOLO + CNN.
                                    </div>
                                </div>
                            )}

                            {/* Loading */}
                            {state.status === "uploading" && (
                                <div className="empty-state">
                                    {state.imageUrl && (
                                        <img
                                            src={state.imageUrl}
                                            alt="Analyse"
                                            className="pulse-anim"
                                            style={{ maxHeight: "180px", borderRadius: "12px", marginBottom: "1.5rem", objectFit: "contain", border: "1.5px solid #E4E7EC" }}
                                        />
                                    )}
                                    <div className="spinner-border text-primary mb-3" style={{ width: "2.25rem", height: "2.25rem" }} />
                                    <div style={{ fontWeight: 700, color: "#344054", marginBottom: "0.3rem" }}>Analyse en cours...</div>
                                    <div style={{ fontSize: "0.78rem", color: "#667085" }}>
                                        YOLO détecte → CNN classifie → Distance calculée
                                    </div>
                                </div>
                            )}

                            {/* Erreur */}
                            {state.status === "error" && state.errorMsg && (
                                <div>
                                    <div className="error-alert mb-4">
                                        <span>⚠️</span>
                                        <div>
                                            <div>Erreur de connexion</div>
                                            <div style={{ fontWeight: 400, fontSize: "0.8rem", marginTop: "2px" }}>{state.errorMsg}</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2" style={{ background: "#F9FAFB", border: "1px solid #E4E7EC", fontSize: "0.8rem", color: "#667085" }}>
                                        <strong style={{ color: "#344054" }}>Vérifier que :</strong>
                                        <ul className="mb-0 mt-1 ps-3">
                                            <li>Le backend FastAPI tourne sur <code>localhost:8000</code></li>
                                            <li>Les modèles sont dans le dossier <code>models/</code></li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Succès */}
                            {state.status === "success" && state.response && (
                                <div className="fade-in">
                                    {state.imageUrl && (
                                        <div className="text-center mb-4">
                                            <img
                                                src={state.imageUrl}
                                                alt="Analysée"
                                                style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "12px", objectFit: "contain", border: "1.5px solid #E4E7EC", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                                            />
                                        </div>
                                    )}
                                    <DetectionGrid detections={state.response.detections} />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            {/* FOOTER */}
            <footer className="app-footer">
                <div className="container">
                    Object-Finder — Projet académique 4ème année Data Science &amp; IA
                    &nbsp;·&nbsp; École Polytechnique de Sousse
                    &nbsp;·&nbsp; Mohamed Khalil Khelifi
                </div>
            </footer>
        </>
    )
}
