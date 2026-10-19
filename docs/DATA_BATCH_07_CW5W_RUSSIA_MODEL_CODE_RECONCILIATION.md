# Data batch 07 — CW5W 4B12 Russia: model-code reconciliation

**Date:** 2026-10-19  
**Scope:** reconcile the Russian-market CW5W / 4B12 identity tables across available 2008, 2009, 2010 and 2012 service-manual copies. This is an evidence ledger only; it does not authorize changes to production vehicle records.

## Source quality and limitation

The linked pages below are hosted copies of Mitsubishi service-manual content on third-party sites, not pages on a Mitsubishi-owned domain. They are useful for identifying publication-specific model-code tables, but are not standalone proof for production data. Mitsubishi's official owner-manual portal is a separate starting point: https://www.mitsubishi-motors.ru/for-mitsubishi-owners/manuals/ . The presence of a manual on a third-party mirror does not prove the exact build date, trim, VIN/frame applicability or factory configuration of a particular vehicle.

## Source-by-source comparison

### 2008 manual copy

Source: [2008 Vehicle Identification / Models](https://mitsubishi.automotive-manuals.com/outlander-2008/M400000100194400ENG.HTML)

The Russia table identifies CW5W / 4B12 / 4WD:
- `XNSHZL6Z` and `XNHHZL6Z`: W5MBB, 5-speed manual;
- `XTHHZL6Z`: W1CJA, CVT.

### 2009 manual copy

Source: [2009 Vehicle Identification / Models](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM)

The Russia table likewise identifies:
- `XNSHZL6Z` and `XNHHZL6Z`: CW5W, 4B12, W5MBB 4WD 5MT;
- `XTHHZL6Z`: CW5W, 4B12, W1CJA 4WD CVT.

The table describes these Russian-market variants as five-seat vehicles. This is evidence about the table in this manual edition, not a claim that all CW5W vehicles of every year had five seats.

### 2010 manual copy

Source: [2010 Vehicle Identification / Models](https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/2010/00/html/M100100030430900ENG.HTM)

The Russia table lists the same three model-code families for CW5W / 4B12 / 4WD:
- `XNSHZL6Z` and `XNHHZL6Z`: W5MBB, 5MT;
- `XTHHZL6Z`: W1CJA, CVT.

The broader Europe table contains other codes and configurations; those must not be transferred to the Russia table merely because chassis and engine names match.

### 2012 manual copy

Source: [2012 Vehicle Identification / Models](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2012/00/html/M100100030615600ENG.HTM)

The Russia section separates 2,000 / 2,400 / 3,000 engine groups. In the 2,400 group, the manual lists:
- `XNSHZL6Z`, `XNSHZLAZ`, `XNHHZL6Z`, `XNHHZLAZ`: 4B12, W5MBB 4WD 5MT;
- `XTHHZL6Z`, `XTHHZLAZ`: 4B12, W1CJA 4WD CVT.

This edition also shows 7-seat codes (`XNXHZLAZ`, `XTXHZLAZ`) in the relevant Russia table. These entries differ from the shorter 2008–2010 lists and should be preserved as edition-specific evidence rather than retroactively assumed for earlier years.

The 2012 table reports displacement as 2,360 mL, whereas 2008–2010 copies report 2,359 mL. Treat this as a source/table presentation difference unless a primary source establishes a genuine technical distinction; do not create separate engine variants from this rounding difference alone.

The model-code legend distinguishes destination/manufacturing identifiers: `6Z` for Russia / MMC-manufactured vehicles and `AZ` for Russia / PCMA-Rus-manufactured vehicles. Do not collapse these suffixes or assume they are interchangeable without VIN/frame-specific evidence.

## Reconciliation decisions

1. **Stable family-level match:** CW5W + 4B12 + W5MBB (4WD 5MT) and CW5W + 4B12 + W1CJA (4WD CVT) recur in the Russia tables across the reviewed manual copies.
2. **Do not generalize the exact code list across editions:** 2008–2010 tables and the 2012 table do not list exactly the same suffix variants or seating configurations.
3. **Do not infer production year from the manual edition:** a 2012 manual table is not proof that a code or configuration was first introduced in 2012, nor that it applies to every vehicle registered in that calendar year.
4. **Do not import equipment or service values from this identity table:** it does not establish brake option, ABS/ASC fitment, suspension spring selection, calibration, OEM part number or maintenance interval.
5. **Keep production records unchanged:** this batch is documentation only. Existing catalog values, technical data, interfaces and Android `appId` are not modified.

## What is still needed for production-grade identification

- An official Mitsubishi-issued source or authorized EPC lookup mapping the individual VIN/frame number to the full model code and build specification.
- Exact model year/build date and manufacturing source for each Russian-market code, especially `6Z` versus `AZ` suffixes.
- Applicable publication/revision for any service value that is to be imported; identity-table agreement alone does not establish that value's applicability.

**Status:** partially verified at model-family/table level; not production-ready for VIN-level assignment.