/**
 * MOCK del Inicio del Líder Comercial (Lote 2). Espejo del prototipo lci-líder.
 * NO es dato real (Fase 2 = Drizzle).
 */
import type { BadgeTone } from "@/components/portal/badge";

export const CIERRE = { dias: "6 días 15 hrs", estado: "Normal" };

export interface LciCampaign {
  camp: string;
  cod: string;
  estado: string;
  tone: BadgeTone;
  ventaGrupal: string;
  pedidos: string;
  altas: string;
  pedidoPersonal: string;
  cobrabilidad: string;
  titulo: string;
  tituloMonto: string;
  spark: number[];
  active: boolean;
}

export const LCI_CAMPAIGNS: LciCampaign[] = [
  { camp: "Campaña N", cod: "C5", estado: "ACTIVA", tone: "success", ventaGrupal: "$845.200", pedidos: "124", altas: "+12", pedidoPersonal: "$15.400", cobrabilidad: "—", titulo: "Diamante 3", tituloMonto: "$32.270", spark: [38, 40, 45, 44, 52, 58, 63, 68, 74, 80], active: true },
  { camp: "Campaña N-1", cod: "C4", estado: "Gestión de pagos", tone: "warn", ventaGrupal: "$810.500", pedidos: "118", altas: "+8", pedidoPersonal: "$14.200", cobrabilidad: "92%", titulo: "Diamante 2", tituloMonto: "$28.500", spark: [60, 62, 63, 66, 68, 70, 72, 74, 76, 78], active: false },
  { camp: "Campaña N-2", cod: "C3", estado: "CERRANDO", tone: "info", ventaGrupal: "$720.000", pedidos: "110", altas: "+5", pedidoPersonal: "$12.500", cobrabilidad: "100%", titulo: "Oro 1", tituloMonto: "$18.200", spark: [55, 58, 60, 62, 65, 68, 70, 72, 74, 76], active: false },
];
