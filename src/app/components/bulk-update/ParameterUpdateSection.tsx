import React, { Fragment, useRef, useState } from 'react';
import { Flex } from '@dynatrace/strato-components-preview';
import { CodeEditor } from '@dynatrace/strato-components-preview/editors';
import { FormField, Select, SelectOption } from '@dynatrace/strato-components-preview/forms';
import { BulkConfig, ConfigParam, ConfigParamChangeAction, InitialBulkConfig } from '../../utils/models';
import { ParameterUpdateDescription } from './ParameterUpdateDescription';
import { validateParamType } from '../../utils/display';
import { Text } from '@dynatrace/strato-components-preview/typography';
import Colors from '@dynatrace/strato-design-tokens/colors';

interface ParamUpdateSectionProps {
  availableConfigParameters: ConfigParam[];
  selectedParam: ConfigParam[] | null;
  onSelectedParamChange: (param: ConfigParam[]) => void;
  dispatchParamChangeFn: (action: ConfigParamChangeAction) => void;
  initialBulkConfig: InitialBulkConfig;
  updatedBulkConfig: BulkConfig;
}

export const ParameterUpdateSection = (props: ParamUpdateSectionProps) => {
  const {
    availableConfigParameters,
    selectedParam,
    onSelectedParamChange: setSelectedParam,
    dispatchParamChangeFn,
    initialBulkConfig,
    updatedBulkConfig,
  } = props;

  const getInitialContent = (selectedParam: ConfigParam[] | null) => {
    if (selectedParam) {
      const wrapper: BulkConfig = {};
      switch (selectedParam[0]) {
        case ConfigParam.TAGS:
          wrapper.tags = initialBulkConfig.tags;
          break;
        case ConfigParam.OUTAGE_HANDLING:
          wrapper.outageHandling = initialBulkConfig.outageHandling;
          break;
        default:
          return '';
      }
      return JSON.stringify(wrapper, null, 2);
    }
    return '';
  };

  const [editorContent, setEditorContent] = useState<string>(() => getInitialContent(selectedParam));
  const [error, setError] = useState<string | undefined>(undefined);

  const timeoutId = useRef<number | undefined>(undefined);
  const editorContentChangeHandler = (content: string) => {
    setEditorContent(content);
    /** used debouncing to prevent recalculating bulk configuration values on every keystroke in the editor */
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = window.setTimeout(() => {
      const actionType = selectedParam === null ? null : selectedParam[0];
      if (actionType !== null) {
        const { validatedConfig, error } = validateParamType(content, actionType);
        setError(error);
        if (validatedConfig) {
          dispatchParamChangeFn({
            type: actionType,
            updatedValue: validatedConfig,
          });
        }
      }
    }, 500);
  };

  function selectedConfigParamChangeHandler(selectedKeys: ConfigParam[]) {
    setSelectedParam(selectedKeys);
    const wrapper: BulkConfig = {};
    const currentKey = selectedKeys[0];
    switch (currentKey) {
      case ConfigParam.FREQUENCY:
        wrapper.frequencyMin = updatedBulkConfig.frequencyMin ?? initialBulkConfig.frequencyMin;
        break;
      case ConfigParam.LOCATIONS:
        wrapper.locations = updatedBulkConfig.locations ?? initialBulkConfig.locations;
        break;
      case ConfigParam.MANUALLY_ASSIGNED_APPS:
        wrapper.manuallyAssignedApps = updatedBulkConfig.manuallyAssignedApps ?? initialBulkConfig.manuallyAssignedApps;
        break;
      case ConfigParam.OUTAGE_HANDLING:
        wrapper.outageHandling = updatedBulkConfig.outageHandling ?? initialBulkConfig.outageHandling;
        break;
      case ConfigParam.TAGS:
        wrapper.tags = updatedBulkConfig.tags ?? initialBulkConfig.tags;
        break;
      default:
        break;
    }
    setEditorContent(JSON.stringify(wrapper, null, 2));
  }

  return (
    <Fragment>
      <FormField label='Select configuration parameter'>
        {
          <Select
            name='config-parameter'
            id='config-parameter-select'
            selectedId={selectedParam}
            onChange={selectedConfigParamChangeHandler}
          >
            {availableConfigParameters.map((configParameter: ConfigParam) => (
              <SelectOption key={configParameter} id={configParameter}>
                {configParameter}
              </SelectOption>
            ))}
          </Select>
        }
      </FormField>
      <Flex flexItem height={300}>
        <CodeEditor language='json' lineWrap fullHeight value={editorContent} onChange={editorContentChangeHandler} />
      </Flex>
      {error && <Text style={{ color: Colors.Text.Critical.Default }}>Error: {error}</Text>}
      <ParameterUpdateDescription selectedParam={selectedParam?.[0]} />
    </Fragment>
  );
};
