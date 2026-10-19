# Outlander CW5W / 4B12 — Russia market evidence (5-speed manual)

Status: **partially verified at source-document level; app data not approved**. This note records exact manual pages found; it is not a production data pack.

## Candidate identity — Russia market only

- Chassis: CW5W
- Engine: 4B12 DOHC MIVEC petrol, 2,359 mL.
- Transmission: W5MBB, 4WD 5-speed manual.
- Russian model codes: XNSHZL6Z and XNHHZL6Z.
- Factory manual lists output 125 kW at 6,000 rpm and torque 232 N·m at 4,100 rpm for the 4B12 CW5W specification table. Verify exact MY/VIN scope before exposing these values in app UI.

## Technical evidence located

1. [2009 Outlander service manual — Russia model table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM) lists CW5W, 4B12 (2,359 mL), W5MBB 4WD 5-speed manual, and Russia model codes XNSHZL6Z / XNHHZL6Z.
2. [2009 W5MBB manual transmission general information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/22/html/M222000010106700ENG.HTM) lists the 5-speed ratios: 3.538 / 1.913 / 1.333 / 1.028 / 0.820, reverse 3.583, final reduction 4.562.
3. [2010 manual transmission lubricants](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2010/22/html/M122100040091300ENG.HTM) lists DIAQUEEN NEW MULTI GEAR OIL API GL-3 SAE 75W-80 and 2.5 L for F5MBB/W5MBB; transfer oil for 4WD is listed separately as hypoid gear oil API GL-5 SAE 80 or 90, 0.49 L. These values need exact model-year/revision confirmation before app use.
4. [2009 transfer and manual transmission service procedures](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/spec/pdf/4753343558CW8W_08_003_ENG.pdf) describes the W5MBB transmission and transfer oil maintenance procedure; it is a PDF copy of the workshop manual.
5. [2010 CW5W major specifications](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2010/00/html/M100100090445300ENG.HTM) lists Russia model codes XNSHZL6Z / XNHHZL6Z, 4B12, 2,359 mL, 125 kW / 6,000 rpm, 232 N·m / 4,100 rpm, and W5MBB 5-speed manual.
6. [Official Mitsubishi Motors Corporation bulletin MSB-08E22-002](https://mmc-manuals.ru/msb/BASE/003/2008/MSB-08E22-002/E/MSB-08E22-002.pdf) identifies the 2008 workshop manual publication CGXE08E2-CD and includes a EUR/Russia applicability section for manual-transmission service points; the specific bulletin is about shift/select cable service points, not lubricant capacity.
7. [Official Mitsubishi Motors Russia owner-manual portal](https://www.mitsubishi-motors.ru/for-mitsubishi-owners/manuals/) — the visible public list did not show a CW5W-era owner manual.

## Source-quality assessment

Technical pages are copies of Mitsubishi workshop-manual content hosted by MMC-Manuals.ru, not pages on a Mitsubishi corporate domain. The cited MSB is issued by Mitsubishi Motors Corporation and identifies the factory manual publication family, but it does not independently validate every technical value listed above. The full manual has not been obtained through an authorized dealer portal, and exact revision/VIN boundaries for a particular vehicle remain unconfirmed.

## Stop conditions

- Do not mark all fields as verified solely because a manual copy is available on a mirror.
- Treat lubricant and quantity values as provisional until revision and market scope are matched to a specific vehicle.
- Confirm transfer-oil capacity and whether the listed amount is a service fill before production use.
- No service-critical values have been promoted into app data.
- Do not combine F5MBB (2WD) and W5MBB (4WD) data indiscriminately.
