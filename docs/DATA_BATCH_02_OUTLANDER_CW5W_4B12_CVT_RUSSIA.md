# Outlander CW5W / 4B12 — Russia market evidence (CVT)

Status: **partially verified at source-document level; app data not approved**. This note records the exact manual pages found; it is not a production data pack.

## Candidate identity — Russia market only

- Chassis: CW5W
- Engine: 4B12 DOHC MIVEC petrol, 2,359 mL.
- Transmission: W1CJA, 4WD CVT.
- Russian model code: XTHHZL6Z.
- Factory manual lists output 125 kW at 6,000 rpm and torque 232 N·m at 4,100 rpm for the 4B12 CW5W specification table. Verify exact MY/VIN scope before exposing these values in app UI.

## Technical evidence located

1. [2009 Outlander service manual — Russia model table](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM) lists CW5W, 4B12 (2,359 mL), W1CJA 4WD CVT, and Russia model code XTHHZL6Z.
2. [2009 W1CJA CVT general information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/23/html/M223100010026200ENG.HTM) lists DIA QUEEN CVTF-J1 and approximate total capacity 7.8 L, plus gear ratios and CVT specification.
3. [Official Mitsubishi Motors Corporation bulletin MSB-08E23-506](https://mmc-manuals.ru/msb/BASE/003/2008/MSB-08E23-506/E/MSB-08E23-506.pdf) explicitly states EUR/Russia applicability for 2008–2009 Outlander CW0W and identifies workshop manual publications CGXE08E2-CD / CGXE09E1-CD. This bulletin corrects CVT diagnostic data-list values; it does not itself establish fluid capacity.
4. [2010 CW5W major specifications](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2010/00/html/M100100090445300ENG.HTM) lists Russia model codes XNSHZL6Z, XNHHZL6Z, XTHHZL6Z, 4B12, 2,359 mL, 125 kW / 6,000 rpm, 232 N·m / 4,100 rpm, and W1CJA CVT for XTHHZL6Z.
5. [Official Mitsubishi Motors Russia owner-manual portal](https://www.mitsubishi-motors.ru/for-mitsubishi-owners/manuals/) — the visible public list did not show a CW5W-era owner manual.

## Source-quality assessment

The technical pages are copies of Mitsubishi workshop-manual content hosted by MMC-Manuals.ru, not pages on a Mitsubishi corporate domain. The separate MSB PDF is issued by Mitsubishi Motors Corporation and confirms the factory manual publication/revision family and EUR/Russia scope for the CVT diagnostic correction. I have not obtained the full manual through an authorized dealer portal or confirmed the exact revision/VIN boundaries for a particular vehicle.

## Stop conditions

- Do not mark all fields as verified solely because a manual copy is available on a mirror.
- CVTF-J1 and approximately 7.8 L are recorded as source values, not yet approved for production data; total service refill quantity may differ from dry/assembly capacity.
- Model year, VIN/trim boundaries, maintenance interval, and exact service refill quantity remain unresolved.
- No service-critical values have been promoted into app data.
- Do not mix these values with later CVT revisions (e.g. CVTF-J4) or other model generations.
