import { DesktopTopBar } from "@/components/shells/desktop-topbar";
import { AwareMark } from "@/components/portal/aware-mark";

export default function AdminCampaniasPage() {
  return (
    <>
      <DesktopTopBar title="Config. campañas" initials="DA" />

      <div className="grid flex-1 place-items-center px-6 py-16">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="grid size-16 place-items-center rounded-2xl" style={{ background: "var(--aw-violet)" }}>
            <AwareMark size={34} />
          </div>

          <span
            className="mt-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ background: "var(--aw-violet-light)", color: "var(--aw-violet-ink)" }}
          >
            Próximamente
          </span>

          <h2 className="mt-3 text-[20px] font-extrabold tracking-[-0.02em] text-foreground">Configuración de campañas</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            La configuración de campañas se define en una próxima etapa.
          </p>
        </div>
      </div>
    </>
  );
}
