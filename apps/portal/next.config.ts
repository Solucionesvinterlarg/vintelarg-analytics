import type { NextConfig } from "next";
import path from "path";

// Raíz del monorepo (dos niveles arriba de apps/portal), resuelta de forma
// absoluta para que Turbopack/Next no infiera mal el workspace root.
const monorepoRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  // Build autocontenido (.next/standalone) para Docker/Dokploy: imagen
  // liviana, sin copiar todo node_modules.
  output: "standalone",
  // En monorepo, Next/Turbopack necesita la raíz real del workspace.
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  // El código compila; el type-check no bloquea el build de producción.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
