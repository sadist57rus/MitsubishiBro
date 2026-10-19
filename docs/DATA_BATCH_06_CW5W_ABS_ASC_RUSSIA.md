# Data batch 06 — Outlander XL CW5W 4B12 (Russia): ABS / ASC evidence

**Date:** 2026-10-19  
**Scope:** evidence ledger for the Russian-market Mitsubishi Outlander XL CW5W 4B12 family. This document does not authorize importing equipment fitment or service values into the production catalogue.

## Market and identity boundary

The hosted copy of the 2009 service manual identifies these Russian-market CW5W 4B12 variants:
- `XNSHZL6Z` and `XNHHZL6Z`: W5MBB 4WD, 5-speed manual;
- `XTHHZL6Z`: W1CJA 4WD CVT.

Source: [2009 MODELS — Vehicles for Russia](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/00/html/M100100030323200ENG.HTM).

The pages below are hosted copies of service-manual content on MMC-Manuals.ru, not Mitsubishi-owned web pages. They are research leads, not sufficient standalone primary-source proof for production data.

## ABS — architecture described in the 2009 manual

Source: [2009 Anti-skid Braking System — General Information](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/35/html/M235100010126400ENG.HTM).

The manual page describes:
- four wheel-speed sensors, with independent control of all four wheels;
- a magnetic encoder for wheel-speed detection rather than a toothed rotor;
- 86 magnetic poles per wheel encoder (43 north and 43 south);
- EBD (electronic brake-force distribution);
- a G-sensor integrated into the ABS-ECU for 4WD vehicles;
- CAN communication and diagnostic/fail-safe functions.

**Applicability status: partially verified at manual-family level only.** The excerpt does not conclusively establish that every item is fitted to every Russian CW5W 4B12 trim/build date. Do not treat this list as a universal equipment-fitment declaration without the exact model code, model year, equipment level and applicable manual revision.

## ASC / TCL — functions described in the 2009 manual

Source: [2009 Active Stability Control System — Sensor](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/2009/35/html/M235500110020000ENG.HTM).

The page describes a G & yaw-rate sensor that detects yaw rate and lateral/longitudinal acceleration, with the longitudinal-acceleration exception noted for 2WD. It also describes an ASC OFF switch and says TCL, stability-control and brake-control functions can be disabled by holding the switch for 3 seconds; a 15-second hold is described as a response to a stuck-switch countermeasure. The same page states stability control is available at vehicle speeds of 15 km/h or more.

These are descriptions of the system and its operation, **not proof that ASC/TCL is installed on every Russian CW5W 4B12 vehicle**. The excerpt also does not establish the exact market/trim availability, ECU part numbers, calibration IDs or diagnostic thresholds for each model code.

## Production-data decision

- Do not infer ABS/ASC fitment solely from `CW5W`, `4B12` or 4WD.
- Do not add ECU part numbers, sensor replacement part numbers, torque values, diagnostic thresholds or calibration data from this evidence alone.
- Keep exact equipment fitment `unverified` until checked against a Mitsubishi-issued publication applicable to the exact Russian model code/build or an authoritative VIN/frame-specific source.
- If a vehicle-specific record is later added, record model code, model year/build date, market, transmission, drivetrain, equipment option, source edition/page, status and limitations separately.

No application code, vehicle records, existing technical values, interfaces or Android `appId` were changed in this batch.
