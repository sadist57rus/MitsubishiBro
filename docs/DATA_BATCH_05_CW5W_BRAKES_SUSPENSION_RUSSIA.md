# Data batch 05 — Outlander XL CW5W 4B12 (Russia): brakes and suspension evidence

**Scope:** Mitsubishi Outlander XL / CW5W, Russian-market applicability only where explicitly identified. This is an evidence ledger, not a production-data import.

**Current status:** partially verified at document-family level; individual maintenance values remain provisional until the exact model year, configuration and revision are established against an authoritative Mitsubishi source.

## Market and configuration boundary

The 2009 service-manual copy lists Russian-market CW5W variants:
- `XNSHZL6Z` and `XNHHZL6Z`: 4B12 2,359 mL, W5MBB 4WD 5-speed manual;
- `XTHHZL6Z`: 4B12 2,359 mL, W1CJA 4WD CVT.

Source: [2009 MODELS — Russia table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM).

The linked manual pages are hosted copies, not pages on a Mitsubishi-owned domain. Treat them as leads to the service-manual publication, not as sufficient primary-source proof for a production database.

## Brakes — evidence located

Source: [2009 Basic Brake System — General Information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/35/html/M235000010140900ENG.HTM).

The 2009 page describes the following standard brake-system configuration:
- front: floating caliper, two pistons, ventilated disc; effective diameter × thickness 247 × 24 mm; cylinder bore 42.8 mm; nominal pad thickness 10.0 mm;
- rear: floating single-piston caliper, solid disc; effective diameter × thickness 258 × 10 mm; cylinder bore 38.1 mm; nominal pad thickness 10.0 mm;
- tandem master cylinder, 22.2 mm bore; 10-inch brake booster; EBD.

Source: [2008 Disc Brake Pad Check and Replacement](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2008/35/html/M135100230090101ENG.HTM) gives pad thickness standard 10.0 mm and limit 2.0 mm, and says to replace pads on both sides of an axle as a set when below the limit.

**Status: partially verified / not production-ready.** These are values from mirrored manual pages. The brake-system overview appears in the 2009 CW service-manual family, but the retrieved excerpt does not independently establish that every figure applies to every Russian CW5W trim/year. The 2.0 mm pad limit comes from a 2008 procedure page and must not be silently generalized to all later model years. Before importing, confirm exact Russian model code and year, the applicable service-manual revision, and whether disc dimensions/limits vary by brake option or supersession.

Do not infer front/rear disc minimum thickness from another model or from a North American manual. No production value for disc wear limits is approved in this batch.

## Suspension — evidence located

Sources:
- [2009 Front Suspension — General Information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/33/html/M233000010144100ENG.HTM)
- [2009 Rear Suspension — General Information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/34/html/M234000010088102ENG.HTM)
- [2009 Suspension Installation Dimensions](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/02/html/M402001300200900ENG.HTM)

The pages describe:
- front suspension: MacPherson strut with coil spring;
- rear suspension: trailing-arm-type multi-link;
- front alignment values shown on the 2009 page: camber 0°20′, caster 2°35′, kingpin inclination 12°45′, toe-in 1 ± 2 mm;
- rear alignment values shown on the 2009 page: camber −0°25′, toe-in 3 ± 2 mm;
- separate body/suspension installation measurement-point dimensions are documented in the installation-dimensions page.

**Status: partially verified / not production-ready.** The alignment table includes configuration-dependent values and may distinguish wheel/tire, engine, seating or suspension-height variants elsewhere in the manual. Do not expose the alignment numbers as universal Russian CW5W specifications until the exact variant and measurement convention are confirmed. Do not use installation-body dimensions as replacement-part dimensions.

## Production-data decision

No vehicle records, technical values, interfaces, application identifiers or Android `appId` were changed. No brake or suspension values are approved for production import by this document.

Recommended next evidence steps:
1. Locate the exact 2009/2010 Russian-market CW5W tables for brake-disc thickness limits and front/rear alignment, including all footnotes/options.
2. Cross-check against Mitsubishi-issued workshop manual publication/revision information or a Mitsubishi-authorized source; preserve the source page and revision in the data record.
3. Only after confirmation, record each field with market, model code, model year, drivetrain, source URL, status and review date.
4. Keep unknown or conflicting values null/unverified rather than filling them from a neighboring market or model.
