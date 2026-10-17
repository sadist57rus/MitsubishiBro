import { OUTLANDER_BULBS_DATA } from './bulbsData';
import { UNDERHOOD_FUSES, CABIN_FUSES } from './fusesData';
import { TUNING_DATABASE } from './tuningData';
import { REPAIR_GUIDES } from './guidesData';
import { FLUIDS_DATA, TORQUE_SPECS_DATA, MAINTENANCE_SCHEDULE_TEMPLATE } from './maintenanceData';
import { OBD_CODES_DATA } from './obdData';
import { SOURCE_BACKED_PARTS } from './sourceBackedPartsCatalog';

/**
 * Shared lookup contract for vehicle-specific datasets. Never use a default
 * model's dataset as a fallback for another selected vehicle.
 */
export interface VehicleDataBundle {
  modelId: string;
  bulbs: typeof OUTLANDER_BULBS_DATA;
  fuses: { underhood: typeof UNDERHOOD_FUSES; cabin: typeof CABIN_FUSES };
  tuning: typeof TUNING_DATABASE;
  guides: typeof REPAIR_GUIDES;
  maintenance: { fluids: typeof FLUIDS_DATA; torque: typeof TORQUE_SPECS_DATA; schedule: typeof MAINTENANCE_SCHEDULE_TEMPLATE };
  obd: typeof OBD_CODES_DATA;
  parts: typeof SOURCE_BACKED_PARTS;
}
const OUTLANDER_I_MODEL_ID = 'outlander-1';
const OUTLANDER_I_DATA: VehicleDataBundle = {
  modelId: OUTLANDER_I_MODEL_ID,
  bulbs: OUTLANDER_BULBS_DATA,
  fuses: { underhood: UNDERHOOD_FUSES, cabin: CABIN_FUSES },
  tuning: TUNING_DATABASE,
  guides: REPAIR_GUIDES,
  maintenance: { fluids: FLUIDS_DATA, torque: TORQUE_SPECS_DATA, schedule: MAINTENANCE_SCHEDULE_TEMPLATE },
  obd: OBD_CODES_DATA,
  parts: SOURCE_BACKED_PARTS
};
export function getDataFor(modelId: string): VehicleDataBundle | undefined {
  return modelId === OUTLANDER_I_MODEL_ID ? OUTLANDER_I_DATA : undefined;
}
