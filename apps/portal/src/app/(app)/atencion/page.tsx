import { getTickets, getTicketMetrics } from "@/lib/queries";
import { AtencionView } from "@/features/atencion/atencion-view";

export const dynamic = "force-dynamic";

export default async function AtencionPage() {
  const [tickets, metrics] = await Promise.all([getTickets(), getTicketMetrics()]);
  return <AtencionView tickets={tickets} metrics={metrics} />;
}
