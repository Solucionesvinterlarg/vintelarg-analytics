# vintelarg-Analytics — Documentación de Dashboards Aware

**Fuente**: Consolidado V4 (Abril 2026) — Equipo Comercial AscendNova
**Análisis**: Mayo 2026
**Documentación completa en Obsidian**: `vintelarg-vault/modulos/analytics/`

## Archivos en esta carpeta

| Archivo | Contenido |
|---------|-----------|
| `Analisis_Consolidado_V4.md` | Resumen ejecutivo del PPT (estructura, pantallas, KPIs, roles) |
| `Prompts_v0dev_Dashboards_Aware.md` | 10 prompts listos para v0.dev |
| `Conceptos_a_definir.md` | 89 conceptos de negocio pendientes de definición |

## Documentación en Obsidian (vintelarg-vault)

```
modulos/analytics/
├── repo.md
├── funcional/
│   ├── dashboards-aware.md          ← Spec funcional completa
│   ├── kpis-aware.md                ← 46 KPIs
│   ├── roles-vistas.md              ← Matriz de acceso (6 roles)
│   ├── definiciones.md              ← Glosario de venta directa
│   └── conceptos-a-definir.md       ← 89 preguntas para el negocio
├── diseño/
│   ├── pantallas.md                 ← Mapa de 40+ pantallas
│   ├── prompts-v0dev.md             ← Índice de prompts
│   └── referencias/
│       ├── analisis-consolidado-v4.md
│       └── prompts-v0dev-completos.md
└── tecnico/
    └── decisiones/
        └── ADR-001-dashboards-nativos.md
```

## Próximos pasos

1. Definir conceptos de negocio (categorías 1–5 son bloqueantes)
2. Definir tablas de datos con las definiciones
3. Generar pantallas interactivas en v0.dev con los prompts
4. Desarrollo en Next.js 16
