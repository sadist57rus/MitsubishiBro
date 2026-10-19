# Data batch 08 — CW5W / 4B12 / W1CJA CVT fluid evidence (Russia)

**Status:** evidence ledger only; no production catalog values approved.  
**Scope:** Russian-market Outlander XL CW5W, 4B12, 4WD, W1CJA CVT. Do not apply to W5MBB manual transmission or to other CVT generations.

## Identity boundary

The Russia-market model-code tables in the 2008–2010 service-manual copies identify CW5W / 4B12 / 4WD / W1CJA CVT as model code `XTHHZL6Z`. This establishes a model-family candidate, not applicability to an individual VIN, build date, or exact service-manual revision.

- 2008 manual copy, Russia model table: https://mitsubishi.automotive-manuals.com/outlander-2008/M400000100194400ENG.HTML
- 2009 manual copy, Russia model table: https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM
- 2010 manual copy, Russia model table: https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/2010/00/html/M100100030430900ENG.HTM

These are third-party-hosted copies of workshop-manual content, not direct Mitsubishi-hosted technical pages.

## CVT fluid and capacity evidence

| Evidence source | Fluid / quantity shown | What it supports | Limitation |
|---|---|---|---|
| 2009 W1CJA CVT general information | DIA QUEEN CVTF-J1; approximate total capacity 7.8 L | A source-specific total-capacity figure for the described W1CJA specification | Third-party mirror; exact revision/VIN boundary not confirmed |
| W1CJA/F1CJA service procedure copy | CVTF-J1; about 5.5 L for drain-and-refill; drain-plug torque 34 ± 2 N·m | Procedure-specific service refill and fastener figure in that copy | Not interchangeable with total system capacity; applicability to this exact Russian-market vehicle not established |
| Later W1CJA/F1CJA specification copies | Total capacity 7.1 L; some documents show CVTF-J4 | Demonstrates that later documentation contains different fluid/capacity values | Different publication/specification context; must not be merged into the 2009 Russia-market candidate without revision evidence |

Reference pages for comparison:
- 2009 W1CJA CVT general information: https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/23/html/M223100010026200ENG.HTM
- W1CJA on-vehicle service procedure copy: https://cw.mioutlander.com/on_vehicle_service-1647.html
- 2010/2012 and later service-manual copies should be checked against their own model-code tables and publication revisions before comparing values.

## Decision

The available evidence is **conflicting and not primary-source-complete** for a production recommendation. The 7.8 L total-capacity figure, 7.1 L figure, CVTF-J1/CVTF-J4 distinction, 5.5 L drain-and-refill amount, and 34 ± 2 N·m drain-plug torque must remain **unverified for a specific vehicle**. Do not present any of them as universal CW5W / 4B12 / W1CJA service instructions.

No production catalog values are proposed by this document. In particular:
- Fluid specification for an individual vehicle: `null / unverified`
- Total capacity applicable to an individual vehicle: `null / unverified`
- Drain-and-refill amount applicable to an individual vehicle: `null / unverified`
- Drain-plug torque applicable to an individual vehicle: `null / unverified`
- Maintenance interval: `null / unverified`

## What would resolve the uncertainty

1. Obtain the applicable Mitsubishi-issued workshop manual or authorized EPC/service information for the vehicle's full model code, build date and VIN/frame.
2. Confirm the fluid specification and publication/revision applicability independently of the capacity table.
3. Keep total system capacity separate from drain-and-refill quantity.
4. Only after those checks, consider a separate production-data change with tests. This documentation-only change does not authorize import into app data.

## Scope guard

Documentation only. Do not change vehicle records, technical catalog values, UI, or Android `appId`. Do not infer CVT data from W5MBB manual-transmission sources.