export type Wildcard = '*';

export type DisplayMode = 'same-type' | 'mixed';

/** All configuration parameters available for bulk update */
export const enum ConfigParam {
  LOCATIONS = 'locations',
  FREQUENCY = 'frequency',
  MANUALLY_ASSIGNED_APPS = 'manuallyAssignedApps',
  OUTAGE_HANDLING = 'anomalyDetection.outageHandling',
  TAGS = 'tags',
  OTHER = 'other',
}

export type OutageHandlingParam = {
  globalOutage: boolean | Wildcard | '';
  globalOutagePolicy: {
    consecutiveRuns: number | Wildcard | '';
  };
};

export type TagParam = {
  key: string;
  value?: string;
};

/** Wrapper object used for displaying parameters in the editor and storing changes in state */
export type BulkConfig = {
  frequencyMin?: number | Wildcard;
  locations?: string[];
  manuallyAssignedApps?: string[];
  outageHandling?: OutageHandlingParam;
  tags?: Array<TagParam | Wildcard>;
};

export type InitialBulkConfig = Required<BulkConfig>;

export type ConfigParamChangeAction = {
  type: ConfigParam;
  updatedValue: BulkConfig;
};

export type ValidationResult = {
  validatedConfig?: BulkConfig;
  error?: string;
};
