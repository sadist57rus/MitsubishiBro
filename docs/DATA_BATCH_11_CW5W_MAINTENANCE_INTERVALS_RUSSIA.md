# Data batch 11 — CW5W / 4B12 Russia: maintenance interval evidence for drivetrain oils

**Date:** 2026-10-19  
**Scope:** Outlander XL / CW5W / 4B12, Russia-market candidate. Research ledger only; no production import.


## Russia-market identity cross-check

The service-manual model-identification tables explicitly include a **VEHICLES FOR RUSSIA** section and list CW5W / 4B12 / W5MBB (4WD, 5-speed manual) as a Russian-market combination in both the 2008-era and 2012-era manual sets:

- [2008-era manual, Russia model table](https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/2008/00/html/M100100030216500ENG.HTM) — the table lists CW5W, engine 4B12, transmission W5MBB under “VEHICLES FOR RUSSIA”.
- [2012 manual, Russia model table](https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/2012/00/html/M100100030615600ENG.HTM) — the Russia section again lists CW5W / 4B12 / W5MBB and distinguishes it from the W1CJA CVT variant.

This verifies that the model/transmission combination exists in the Russia-market documentation set; it **does not by itself prove** that the maintenance schedule table's candidate intervals apply to every Russian production date, model-code suffix, or VIN. The interval values therefore remain research candidates and are not approved for production import.

## Cross-edition comparison

Three third-party-hosted copies of Mitsubishi's Outlander XL *Periodic Inspection and Maintenance* schedule were compared at the schedule-table level. The mileage intervals below match between the 2009, 2011, and 2012 editions, although operation item numbers change between editions because SST-related operations differ. The 2012 schedule extract exposes the manual-transmission row as well as the transfer and rear-differential rows.

| Operation | 2009 edition item | 2011 edition item | Normal usage | Severe usage |
|---|---:|---:|---:|---:|
| Change manual transmission gear oil | B7 | B8 | Every 200,000 km | Every 100,000 km |
| Change transfer gear oil | B8 | B11 | Every 80,000 km | Every 40,000 km |
| Check rear differential for oil leakage; if leaking, check level | B9 | B12 | Every 20,000 km or 12 months | Same listed interval |
| Change rear differential gear oil | B10 | B13 | Every 80,000 km | Every 40,000 km |

The 2012 edition extract lists transfer oil change at 80,000 km normal / 40,000 km severe and rear differential oil change at 80,000 km / 40,000 km; it also retains rear differential leakage/level inspection at 20,000 km or 12 months.

Sources:
- [2009 Outlander XL PDI schedule PDF copy](https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/spec/pdf/4753343558CW_W_09_003_ENG.pdf), printed page 2-7.
- [2011 Outlander XL PDI schedule PDF copy](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/spec/pdf/PDI_4753343558CW_W_11_003_ENG_100.pdf), printed page 2-7.
- [2012 Outlander XL PDI schedule PDF copy](https://faq.out-club.ru/download/outlander-xl/maintenance/Service_Manual_2008_2012/spec/pdf/PDI_4753343558CW_W_12_003_ENG_100.pdf), printed page 2-6 to 2-7; search-indexed schedule text includes manual-transmission, transfer and rear-differential operations.

The search-indexed schedule text from all three editions independently exposes the same interval values and operation descriptions. When both distance and time are listed, the 2011 document says whichever comes first applies. Severe-usage schedules are separate and should not be applied automatically to every vehicle; the manual describes conditions such as dusty/rough roads, prolonged idling or short cold-weather trips, frequent sudden braking, and trailer towing.

## What the comparison establishes — and what it does not

The cross-edition comparison supports that these candidate intervals are not merely a single-table transcription error. However, both documents are third-party-hosted copies rather than files served from a Mitsubishi corporate domain. The official Russian owner-manual portal currently lists newer Outlander model years and does not expose an Outlander XL model-year document in its visible index: https://www.mitsubishi-motors.ru/for-mitsubishi-owners/manuals/

Therefore:
- Exact applicability to the Russian-market CW5W / 4B12, the relevant model-code variants, production date and VIN remains unresolved.
- The matching intervals are **cross-edition corroborated candidates**, not verified production values.
- Do not publish them as universal recommendations for every Russian CW5W vehicle until market/model applicability is confirmed.

## Keep operation types distinct

- A leak check / level check is an inspection operation, not an oil-change interval.
- A scheduled oil change is a separate operation.
- The schedule does not prove the correct oil grade or fill quantity; those remain separate evidence fields.
- The manual transmission, transfer case, and rear differential are separate service points.
- The manual-gearbox interval applies only to vehicles with the applicable manual transmission; do not apply it to the W1CJA CVT variant.

## Decision

- Candidate normal/severe intervals, corroborated across the 2009, 2011 and 2012 schedule copies: manual transmission 200,000/100,000 km; transfer case 80,000/40,000 km; rear differential oil 80,000/40,000 km.
- Rear differential leak inspection candidate: every 20,000 km or 12 months.
- Exact Russia-market model-year/VIN applicability: unresolved.
- Do not promote these to production data until exact publication and model applicability are confirmed.
- No production vehicle records, UI, interfaces, or Android appId changed.
