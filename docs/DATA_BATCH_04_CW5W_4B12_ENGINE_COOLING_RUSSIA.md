# CW5W / 4B12 — engine and cooling evidence (Russia)

Status: **research-only; not approved for app data**.

## Scope

- Market: Russia.
- Chassis: CW5W.
- Engine: 4B12 DOHC MIVEC petrol, 2,359 mL.
- Relevant transmission variants: W5MBB 4WD 5MT and W1CJA 4WD CVT.
- Do not generalize to CW6W / 6B31, diesel CW7W/CW8W, Outlander III, or other markets.

## Engine identity and output

The 2009 and 2010 workshop-manual copies list the Russia-market CW5W 4B12 at 2,359 mL. The 2010 specification table lists 125 kW at 6,000 rpm and 232 N·m at 4,100 rpm. These are consistent across the cited model tables, but exact model-year/VIN applicability should be tied to the vehicle before being exposed as a definitive trim-level record.

Sources:
1. [2009 Models — Russia market table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM)
2. [2009 Major specifications — Russia market table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M200003000195900ENG.HTM)
3. [2010 General data and specifications](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2010/00/html/M100100090445300ENG.HTM)
4. [2009 4B12 base engine](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/11/html/M211200100154400ENG.HTM)

## Engine oil — discrepancy must remain visible

The available workshop-manual copies do not agree on the oil quantity for the Russia-market 4B12:

- [2010 lubricant table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2010/12/html/M112100040244000ENG.HTM): 4B12 total quantity 4.6 L.
- [2012 lubricant table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2012/12/html/M112100040285900ENG.HTM): explicitly lists 4B12 Russia as 4.6 L; 4B12 Europe with oil cooler as 4.7 L.
- [PDI/service procedure PDF copy](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/spec/pdf/PDI_4753343558CW_W_11_003_ENG_100.pdf): includes a 4B12-Russia value of 4.7 L in the engine-oil section.

This is a real source/version conflict, not a value to average. Until the relevant model-year and manual revision are identified, **do not publish a single definitive oil capacity**. Record oil quantity as unresolved in the application data. The specified engine oil classifications also need to be checked against the applicable Russia-market revision rather than copied from another market/year.

## Cooling system — research status

The 2009 workshop manual index contains an engine-cooling section, but this pass has not yet established the Russia-specific coolant type, complete system capacity, refill procedure, thermostat opening specification, radiator-cap pressure, or fan activation thresholds from a revision-matched page.

Navigation:
- [2009 workshop manual contents / engine cooling and service sections](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/index/menu_M2.htm)

Keep these values unset until each is located in the correct engine/market section:
- coolant chemistry / approved product;
- total system capacity vs routine refill quantity;
- concentration range;
- thermostat opening temperature;
- radiator cap pressure;
- fan control thresholds;
- bleed procedure and safety cautions.

## Source-quality note

The detailed workshop-manual pages linked above are copies hosted by MMC-Manuals.ru, not direct Mitsubishi corporate-domain pages. The official Mitsubishi aftersales-bulletin catalogue confirms that CW-generation workshop-manual bulletins exist, but a bulletin listing does not independently validate every technical specification.

Official catalogue:
- [Mitsubishi service bulletins — Outlander CW](https://mmc-manuals.ru/msb/?model=4753343558202020)

## Decision

- Engine identity: consistent across the cited manual tables, but still needs exact vehicle applicability.
- Engine oil capacity: **unresolved conflict (4.6 L vs 4.7 L in copies/revisions)**.
- Cooling-system technical values: **not yet verified**.
- No production app data, existing vehicle records, interfaces, or Android `appId` were changed.
