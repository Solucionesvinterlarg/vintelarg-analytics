"use client";

import Link from "next/link";
import { Mail, Lock, Eye, Compass } from "lucide-react";
import { useEmpStore } from "@/lib/emp-store";

export function LoginView() {
  const notify = useEmpStore((s) => s.notify);
  return (
    <div className="flex min-h-full flex-col px-6">
      <div className="pt-[54px] text-center text-[26px] font-extrabold tracking-[0.02em] text-foreground">
        A<span style={{ color: "var(--aw-violet)" }}>·</span>WARE<sup className="text-[10px] opacity-60">®</sup>
      </div>

      <div className="mt-9">
        <div className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-foreground">Gestioná tu negocio independiente</div>
        <div className="mt-2 text-[15px] italic" style={{ fontFamily: "var(--font-serif)", color: "var(--aw-violet-deep)" }}>todo es posible.</div>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Input Icon={Mail} placeholder="Email" type="email" />
        <Input Icon={Lock} placeholder="Contraseña" type="password" right={<Eye size={18} className="text-muted-foreground" />} />
        <div className="text-right"><button type="button" onClick={() => notify("Te enviamos un correo")} className="emp-press text-[12.5px] font-semibold" style={{ color: "var(--aw-violet)" }}>¿Olvidaste tu contraseña?</button></div>
        <Link href="/api/auth/login" className="emp-press mt-1 flex w-full items-center justify-center rounded-full py-3.5 text-[15px] font-bold text-white" style={{ background: "var(--aw-violet)", boxShadow: "var(--shadow-violet)" }}>Ingresar</Link>
      </div>

      <div className="mt-4 text-center text-[13px] text-muted-foreground">
        ¿Aún no tenés cuenta? <Link href="/acceso/registro" className="emp-press font-bold" style={{ color: "var(--aw-violet)" }}>Registrate acá</Link>
      </div>
      <Link href="/acceso/landing" className="emp-press mt-4 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-semibold text-foreground" style={{ border: "1px solid var(--aw-hairline)", background: "var(--aw-white)" }}>
        <Compass size={16} style={{ color: "var(--aw-violet)" }} /> Explorar sin cuenta
      </Link>

      <div className="mt-auto flex justify-center gap-[18px] py-6 text-[12px] text-muted-foreground">
        <button type="button" onClick={() => notify("Ayuda")} className="emp-press">Ayuda</button>
        <span className="opacity-40">·</span>
        <button type="button" onClick={() => notify("Privacidad")} className="emp-press">Privacidad</button>
      </div>
    </div>
  );
}

function Input({ Icon, placeholder, type, right }: { Icon: typeof Mail; placeholder: string; type: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3.5" style={{ background: "var(--aw-white)", border: "1px solid var(--aw-hairline)" }}>
      <Icon size={18} className="text-muted-foreground" />
      <input type={type} placeholder={placeholder} className="min-w-0 flex-1 border-0 bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground" />
      {right}
    </div>
  );
}
