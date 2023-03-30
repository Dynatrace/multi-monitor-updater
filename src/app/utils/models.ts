
export type Wildcard = '*';

export enum DisplayMode {
  SAME_TYPE, MIXED
}

/** All configuration parameters available for bulk update */
export enum ConfigParam {
  LOCATIONS = 'locations',
  FREQUENCY = 'frequency',
  MANUALLY_ASSIGNED_APPS = 'manuallyAssignedApps',
  OUTAGE_HANDLING = 'anomalyDetection.outageHandling',
  TAGS = 'tags',
  OTHER = 'other'
}

export interface OutageHandlingParam {
  globalOutage: boolean | Wildcard | '';
  globalOutagePolicy: {
    consecutiveRuns: number | Wildcard | '';
  };
}

export interface TagParam {
  key: string;
  value?: string;
}

/** Wrapper object used for displaying parameters in the editor and storing changes in state */
export interface BulkConfig {
  frequencyMin?: number | Wildcard;
  locations?: string[];
  manuallyAssignedApps?: string[];
  outageHandling?: OutageHandlingParam;
  tags?: Array<TagParam | Wildcard>;
}

export type InitialBulkConfig = Required<BulkConfig>;

export interface ConfigParamChangeAction {
  type: ConfigParam;
  updatedValue: BulkConfig;
}

export interface ValidationResult {
  validatedConfig?: BulkConfig;
  error?: string;
}

export interface UpdateState {
  progressCounter: number;
  completed: boolean;
  success: boolean;
  error?: string;
}
