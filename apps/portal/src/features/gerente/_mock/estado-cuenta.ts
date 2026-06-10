/**
 * Datos MOCK de Estado de cuenta (perfil Gerente, Lote 2). Espejo de
 * gerente/screens2.jsx → ScreenCuenta. NO es dato real.
 */
export type CuentaTone = "violet" | "danger" | "warning" | "success";

export interface CuentaKpi {
  label: string;
  value: string;
  tone: CuentaTone;
  icon: string; // nombre lucide
}

export const CUENTA_KPIS: CuentaKpi[] = [
  { label: "Saldo total zona", value: "$8,42 M", tone: "violet", icon: "wallet" },
  { label: "Vencido", value: "$612.400", tone: "danger", icon: "alert-triangle" },
  { label: "Por vencer (7 d)", value: "$1,18 M", tone: "warning", icon: "calendar-clock" },
  { label: "Al día", value: "$6,63 M", tone: "success", icon: "check-circle-2" },
];

export interface Movimiento {
  f: string;
  rev: string;
  concepto: string;
  debe: string;
  haber: string;
  saldo: string;
}

export const MOVIMIENTOS: Movimiento[] = [
  { f: "24/05", rev: "Laura Torres", concepto: "Pago campaña", debe: "", haber: "$312.000", saldo: "$0" },
  { f: "23/05", rev: "Carmen Ruiz", concepto: "Pedido 202608", debe: "$287.000", haber: "", saldo: "$287.000" },
  { f: "23/05", rev: "Sofía Martínez", concepto: "Pago parcial", debe: "", haber: "$120.000", saldo: "$125.000" },
  { f: "22/05", rev: "Elena Díaz", concepto: "Pedido 202608", debe: "$198.000", haber: "", saldo: "$198.000" },
  { f: "21/05", rev: "Rosa Fernández", concepto: "Ajuste / nota crédito", debe: "", haber: "$24.000", saldo: "$0" },
];
