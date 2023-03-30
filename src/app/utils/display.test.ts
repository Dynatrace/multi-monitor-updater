import {getInitialBulkConfig, validateParamType} from "./display";
import {
    SyntheticMonitor
} from "@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor";
import {
    SyntheticMonitorCreatedFrom,
    SyntheticMonitorType,
    TagWithSourceInfoContext,
    TagWithSourceInfoSource
} from "@dynatrace-sdk/client-classic-environment-v1";
import {
    TagWithSourceInfo
} from "@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/tag-with-source-info";
import {ConfigParam, InitialBulkConfig, OutageHandlingParam, TagParam} from "./models";
import {wildcard} from "./constants";

const tag1: TagWithSourceInfo = {
    key: "key1",
    value: "value1",
    source: TagWithSourceInfoSource.User,
    context:TagWithSourceInfoContext.Aws
}

const tag2: TagWithSourceInfo = {
    key: "key2",
    value: "value2",
    source: TagWithSourceInfoSource.User,
    context:TagWithSourceInfoContext.Aws
}

const tag3: TagWithSourceInfo = {
    key: "key3",
    value: "value3",
    source: TagWithSourceInfoSource.User,
    context:TagWithSourceInfoContext.Aws
}

const syntheticMonitor1: SyntheticMonitor = {
    entityId: "id1",
    name: "testBrowserMonitor2",
    frequencyMin: 10,
    type: SyntheticMonitorType.Browser,
    enabled: true,
    createdFrom: SyntheticMonitorCreatedFrom.Api,
    script: "",
    locations: [],
    tags: [tag1, tag2],
    managementZones: [],
    automaticallyAssignedApps: [],
    manuallyAssignedApps: []
}

const syntheticMonitor2: SyntheticMonitor = {
    entityId: "id2",
    name: "testBrowserMonitor2",
    frequencyMin: 10,
    type: SyntheticMonitorType.Browser,
    enabled: true,
    createdFrom: SyntheticMonitorCreatedFrom.Api,
    script: "",
    locations: [],
    tags: [tag2, tag3],
    managementZones: [],
    automaticallyAssignedApps: [],
    manuallyAssignedApps: []
}

const expectedOutageParam: OutageHandlingParam = {
    globalOutage: '',
    globalOutagePolicy: {
        consecutiveRuns: ''
    }
}

const expectedTag2: TagParam = {
    key: 'key2',
    value: 'value2'
}

const expectedBulkConfig: InitialBulkConfig = {
    frequencyMin: 10,
    locations: [],
    tags: [expectedTag2, wildcard],
    manuallyAssignedApps: [],
    outageHandling: expectedOutageParam
}

const tags = '{"tags":[{"key":"my_key","value":"my_value"},{"key":"other_key"},{"key":"new_key","value":"new_value"},"*"]}'
const outage = '{"outageHandling":{"globalOutage":true,"globalOutagePolicy":{"consecutiveRuns":1}}}'
const invalidOutage = '{"outageHandling":{"globalOutage":true}}'
const locations = '{"locations": ["location-1", "*"]}'
const frequency = '{"frequencyMin": 0}'

describe('testing initiation of a display', () => {
    test('empty list should return an object', () => {
        expect(getInitialBulkConfig([])).toBeDefined();
    });
    test('empty list should return an expected object', () => {
        expect(getInitialBulkConfig([syntheticMonitor1, syntheticMonitor2])).toMatchObject(expectedBulkConfig)
    });
    test('validate tag param type', () => {
        expect(validateParamType(tags, ConfigParam.TAGS)).not.toHaveProperty('error');
    })
    test('validate outage param type', () => {
        expect(validateParamType(outage, ConfigParam.OUTAGE_HANDLING)).not.toHaveProperty('error');
    })
    test('validate invalid outage param type', () => {
        expect(validateParamType(invalidOutage, ConfigParam.OUTAGE_HANDLING)).toHaveProperty('error');
    })
    test('validate location param type', () => {
        expect(validateParamType(locations, ConfigParam.LOCATIONS)).not.toHaveProperty('error');
    })
    test('validate frequency param type', () => {
        expect(validateParamType(frequency, ConfigParam.FREQUENCY)).not.toHaveProperty('error');
    })
    test('expect errors for wrong param', () => {
        expect(validateParamType(tags, ConfigParam.LOCATIONS)).toHaveProperty('error');
        expect(validateParamType(tags, ConfigParam.FREQUENCY)).toHaveProperty('error');
        expect(validateParamType(tags, ConfigParam.OUTAGE_HANDLING)).toHaveProperty('error');
        expect(validateParamType(tags, ConfigParam.MANUALLY_ASSIGNED_APPS)).toHaveProperty('error');
    })
    test('unknown param should return empty object', () => {
        expect(validateParamType(tags, ConfigParam.OTHER)).toMatchObject({});
    })
    test('json parse exception should return error', () => {
        expect(validateParamType('{"name":what?}', ConfigParam.TAGS)).toHaveProperty('error');
    })
    test('not expected content should return error', () => {
        expect(validateParamType('[]', ConfigParam.TAGS)).toHaveProperty('error');
    })
});