"use client";

import { Sparkles, MessageCircle, Send } from "lucide-react";
import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { MockBadge } from "@/components/portal/mock-badge";

/**
 * Asistente IA del líder — CASCARÓN VISUAL MOCK (Lote 2), sin lógica.
 *
 * MOCK — reemplazar por el módulo ai-agent real (roadmap Etapa 3) cuando exista.
 * Hoy es solo la UI: saludo + preguntas sugeridas + input no funcional. NO
 * invertir en backend/streaming/contexto acá; cuando llegue ai-agent, este
 * recurso (lci:asistente) pasa a apuntar al módulo real.
 */
const SUGERIDAS = ["¿Quién está en riesgo de baja?", "¿Cuánto me falta para Diamante 1?", "Resumime la cobrabilidad de N"];

export function LciAsistenteView() {
  return (
    <>
      <MockBadge />
      <DesktopTopBar title="Asistente IA" initials="LT" />

      <div className="px-5 pt-5 md:px-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--aw-violet)" }}>Copiloto A·WARE</div>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-foreground">Asistente IA</h2>
      </div>

      <div className="px-5 pb-6 pt-4 md:px-6">
        <div className="flex min-h-[440px] flex-col rounded-2xl bg-card p-5" style={{ border: "0.5px solid var(--aw-hairline)" }}>
          {/* saludo */}
          <div className="flex gap-3">
            <span className="grid size-9 flex-none place-items-center rounded-full" style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet)" }}><Sparkles size={18} /></span>
            <div className="max-w-[85%] rounded-[4px_14px_14px_14px] px-4 py-3 text-[14px] leading-relaxed text-foreground" style={{ background: "var(--aw-app-bg)" }}>
              Hola Laura 👋 Soy tu asistente de A·WARE. Puedo ayudarte con tu red, cobrabilidad, títulos y bonificación. ¿Qué querés ver?
            </div>
          </div>

          {/* sugeridas + input */}
          <div className="mt-auto pt-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGERIDAS.map((q) => (
                <button key={q} type="button" className="rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-secondary" style={{ border: "1px solid var(--aw-hairline)" }}>{q}</button>
              ))}
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3" style={{ border: "1px solid var(--aw-hairline)" }}>
              <MessageCircle size={18} className="text-muted-foreground" />
              <input placeholder="Escribí tu pregunta…" className="min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground" />
              <span className="grid size-9 place-items-center rounded-full text-white" style={{ background: "var(--aw-violet)" }}><Send size={16} /></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
