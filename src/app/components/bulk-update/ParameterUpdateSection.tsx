import React, { Fragment, useRef, useState } from 'react';
import { Flex, Label } from '@dynatrace/strato-components-preview';
import { CodeEditor } from '@dynatrace/strato-components-preview/editors';
import { FormField, SelectV2 } from '@dynatrace/strato-components-preview/forms';
import { BulkConfig, ConfigParam, ConfigParamChangeAction, InitialBulkConfig } from '../../utils/models';
import { ParameterUpdateDescription } from './ParameterUpdateDescription';
import { validateParamType } from '../../utils/display';
import { Text } from '@dynatrace/strato-components-preview/typography';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { FormattedMessage } from 'react-intl';

interface ParamUpdateSectionProps {
  availableConfigParameters: ConfigParam[];
  selectedParam: ConfigParam;
  onSelectedParamChange: (param: ConfigParam) => void;
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

  const getInitialContent = (selectedParam: ConfigParam) => {
    if (selectedParam) {
      const wrapper: BulkConfig = {};
      switch (selectedParam) {
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
        const { validatedConfig, error } = validateParamType(content, selectedParam);
        setError(error);
        if (validatedConfig) {
          dispatchParamChangeFn({
            type: selectedParam,
            updatedValue: validatedConfig,
          });
        }
    }, 500);
  };

  function selectedConfigParamChangeHandler(selectedKey: ConfigParam) {
    setSelectedParam(selectedKey);
    setEditorContent('');
    const wrapper: BulkConfig = {};
    switch (selectedKey) {
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
      <FormField>
        <Label>
          <FormattedMessage defaultMessage='Select configuration parameter' id='Mb0dT7zJAPk5P9+v'/>
        </Label>
        {
          <SelectV2
            name='config-parameter'
            id='config-parameter-select'
            value={selectedParam ?? ConfigParam.OUTAGE_HANDLING}
            onChange={selectedConfigParamChangeHandler}
          >
            <SelectV2.Trigger width='' />
            <SelectV2.Content>
              {availableConfigParameters.map((configParameter: ConfigParam) => (
                <SelectV2.Option key={configParameter} value={configParameter}>
                  {configParameter}
                </SelectV2.Option>
              ))}
            </SelectV2.Content>
          </SelectV2>
        }
      </FormField>
      <Flex flexItem height={300}>
        <CodeEditor
          key={selectedParam ?? ConfigParam.OUTAGE_HANDLING}
          language='json'
          lineWrap
          fullHeight
          value={editorContent}
          onChange={editorContentChangeHandler}
        />
      </Flex>
      {error && (
        <Text style={{ color: Colors.Text.Critical.Default }} textStyle='base'>
          <FormattedMessage defaultMessage='Error: {error}' id='rFjB1mXLK1wQNfh+' values={{ error: error }} />
        </Text>
      )}
      <ParameterUpdateDescription selectedParam={selectedParam} />
    </Fragment>
  );
};
