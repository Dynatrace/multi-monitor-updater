import {getUpdateDto, getUpdateDtoForCurrentSelection} from "./update";
import {
    SyntheticMonitor
} from "@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor";
import {
    SyntheticMonitorCreatedFrom,
    SyntheticMonitorType,
    SyntheticMonitorUpdateType,
    TagWithSourceInfoContext,
    TagWithSourceInfoSource
} from "@dynatrace-sdk/client-classic-environment-v1";
import {BulkConfig, ConfigParam, DisplayMode, InitialBulkConfig, OutageHandlingParam} from "./models";
import {
    SyntheticMonitorUpdate
} from "@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor-update";
import {
    TagWithSourceInfo
} from "@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/tag-with-source-info";
import {wildcard} from "./constants";

const existing: SyntheticMonitor = {
    entityId: "id1",
    name: "testBrowserMonitor1",
    frequencyMin: 10,
    type: SyntheticMonitorType.Browser,
    enabled: true,
    createdFrom: SyntheticMonitorCreatedFrom.Api,
    script: "",
    locations: ['loc1'],
    tags: [],
    managementZones: [],
    automaticallyAssignedApps: [],
    manuallyAssignedApps: ['app1', 'app2'],
}

const initialOutageParam: OutageHandlingParam = {
    globalOutage: true,
    globalOutagePolicy: {
        consecutiveRuns: 1
    }
}

const changedOutageParam: OutageHandlingParam = {
    globalOutage: true,
    globalOutagePolicy: {
        consecutiveRuns: 3
    }
}

const initialBulkConfig: InitialBulkConfig = {
    frequencyMin: 10,
    locations: ['loc1'],
    tags: [],
    manuallyAssignedApps: ['app1', 'app2'],
    outageHandling: initialOutageParam
}

const tag1: TagWithSourceInfo = {
    key: "key1",
    value: "value1",
    source: TagWithSourceInfoSource.User,
    context:TagWithSourceInfoContext.Aws
}

const changedBulkConfig: BulkConfig = {
    frequencyMin: 20,
    locations: [wildcard],
    tags: [tag1, wildcard],
    manuallyAssignedApps: ['app1'],
    outageHandling: changedOutageParam
}

const expected: SyntheticMonitorUpdate = {
    frequencyMin: 20,
    locations: [],
    manuallyAssignedApps: ['app1'],
    name: "testBrowserMonitor1",
    script: {},
    tags: [{source: TagWithSourceInfoSource.User,
        context: TagWithSourceInfoContext.Contextless,
        key: "key1",
        value: "value1"
    }],
    type: SyntheticMonitorUpdateType.Browser,
    enabled: true
}

describe('testing initiation of a update', () => {
    test('getUpdateDto should return expected object', () => {
        expect(getUpdateDto(existing, initialBulkConfig, changedBulkConfig, DisplayMode.SAME_TYPE)).toMatchObject(expected);
    });
    test('only outage should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.OUTAGE_HANDLING);
        expect(dto.frequencyMin).toEqual(existing.frequencyMin);
        expect(dto.frequencyMin).not.toEqual(changedBulkConfig.frequencyMin);
        expect(dto.tags).toEqual(existing.tags);
        expect(dto.tags).not.toEqual(changedBulkConfig.tags);
        expect(dto.locations).toEqual(existing.locations);
        expect(dto.locations).not.toEqual(changedBulkConfig.locations);
        expect(dto.manuallyAssignedApps).toEqual(existing.manuallyAssignedApps);
        expect(dto.manuallyAssignedApps).not.toEqual(changedBulkConfig.manuallyAssignedApps);
        expect(dto.anomalyDetection?.outageHandling.globalOutagePolicy?.consecutiveRuns)
            .toEqual(changedOutageParam.globalOutagePolicy.consecutiveRuns);
    });
    test('only frequency should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.FREQUENCY);
        expect(dto.frequencyMin).toEqual(changedBulkConfig.frequencyMin);
    });
    test('only locations should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.LOCATIONS);
        expect(dto.locations).toEqual([])
    });
    test('only manuallyAssignedApps should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.MANUALLY_ASSIGNED_APPS);
        expect(dto.manuallyAssignedApps).toEqual(changedBulkConfig.manuallyAssignedApps);
    });
    test('only tags should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.TAGS);
        expect(dto.tags.some(t => t.value === 'value1')).toBeTruthy()
    });
    test('nothing should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, ConfigParam.OTHER);
        expect(dto.frequencyMin).toEqual(existing.frequencyMin);
        expect(dto.tags).toEqual(existing.tags);
        expect(dto.locations).toEqual(existing.locations);
        expect(dto.manuallyAssignedApps).toEqual(existing.manuallyAssignedApps);
        expect(dto.anomalyDetection).toEqual(existing.anomalyDetection)
    });
    test('nothing should changed', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, changedBulkConfig, undefined);
        expect(dto).toBeDefined();
    });
    test('tags should not be changed when undefined ', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, {tags: undefined}, ConfigParam.TAGS);
        expect(dto.tags).toEqual(existing.tags);
    });
    test('locations should not be changed when undefined ', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, {locations: undefined}, ConfigParam.LOCATIONS);
        expect(dto.locations).toEqual(existing.locations);
    });
    test('anomaly should not be changed when undefined ', () => {
        const dto = getUpdateDtoForCurrentSelection(existing, initialBulkConfig, {outageHandling: undefined}, ConfigParam.OUTAGE_HANDLING);
        expect(dto.anomalyDetection).toEqual(existing.anomalyDetection);
    });

});