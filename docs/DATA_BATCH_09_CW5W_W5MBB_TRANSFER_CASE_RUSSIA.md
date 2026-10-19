# Data batch 09 — CW5W / 4B12 / W5MBB Russia: transfer case lubrication evidence

**Date:** 2026-10-19  
**Scope:** Outlander XL CW5W / 4B12 / 4WD / W5MBB 5MT, Russia-market candidate only. Evidence ledger; not approved for production app data.

## Keep three assemblies separate

For this vehicle, the manual transmission, transfer case, and rear differential are separate lubrication points. Do not reuse one assembly's fluid specification or quantity for another.

## Transfer case — candidate service values

The available 2008 pre-delivery / periodic maintenance manual PDF copy contains a separate procedure titled **“Change gear oil in transfer case (4WD)”**. It specifies:

- Oil: gear oil, API GL-5, SAE 90.
- Quantity: 0.54 L.
- Fill procedure: fill to the lower edge of the filler-plug hole.
- Drain and filler plug torque listed by this procedure: 32 ± 2 N·m.

Source: [Mitsubishi Outlander XL PDI / periodic maintenance manual PDF copy](https://mmc-manuals.ru/manuals/outlander_xl/online/Service_Manual/spec/pdf/4753343558CW8W_08_003_ENG.pdf), printed pages 2-24 to 2-25 (PDF pages 47-48). The surrounding section separately labels the manual transmission procedure for F5MBB/W5MBB, then gives a distinct transfer-case procedure.

The document is a third-party-hosted copy of Mitsubishi workshop-manual content, not a direct Mitsubishi corporate-domain publication. Its cover/version applicability and exact Russia-market model-year/VIN boundaries have not been independently established in this pass. Therefore the values remain **source-supported candidates**, not verified app values.

## Cross-checks and scope limitations

A separate public service-manual copy for a North American 2009 4B12 CVT model also lists GL-5 SAE 90 and 0.54 L for transfer oil, but it is a different market/transmission application and is only corroborative—not a substitute for the Russia-market manual:
[2009 4B12 CVT transfer oil procedure](https://charm.li/Mitsubishi/2009/Outlander%204WD%20L4-2.4L%20%284B12%29/Repair%20and%20Diagnosis/Transmission%20and%20Drivetrain/Transfer%20Case/Service%20and%20Repair/Procedures/Transfer%20Oil%20Replacement/CVT/)

Do not use North American or later-generation values to infer Russia-market fitment. A separate technical-service bulletin states that the transfer assembly changed from six to five mounting bolts beginning 1 November 2011 and that the later assembly has reduced oil capacity. This is a clear warning that transfer-case revision matters:
[TSB-12-23-003 — revised transfer case oil capacity](https://charm.li/Mitsubishi/2009/Outlander%204WD%20V6-3.0L%20%286B31%29/Repair%20and%20Diagnosis/Technical%20Service%20Bulletins/All%20Technical%20Service%20Bulletins/Drivetrain%20-%20Revised%20Transfer%20Case%20Oil%20Capacity/)

That bulletin's listed applicability does not by itself prove that a particular CW5W/4B12 vehicle has either assembly. Confirm production date and transfer-unit configuration before exposing a definitive quantity.

## Do not confuse with rear differential

The same PDI manual has a separate rear-differential procedure listing API GL-5 SAE 80W and 0.5 L. These are **rear differential** values, not transfer-case values. They are not promoted by this batch.

## Decision

- Transfer case candidate: API GL-5 SAE 90; 0.54 L; fill to lower edge of filler-plug hole.
- Evidence status: **partially verified at document level; exact market/year/transfer-unit applicability unresolved**.
- Plug torque: present in the manual copy but not approved for app display until exact revision/applicability is confirmed.
- Production catalog, existing vehicle records, interfaces, and Android `appId` unchanged.
