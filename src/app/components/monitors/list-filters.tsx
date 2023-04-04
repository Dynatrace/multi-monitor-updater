import React, {cloneElement, ReactElement} from 'react';
import {FilterBar, FilterItemValues} from '@dynatrace/strato-components-preview/filters';
import {Select, SelectOption, TextInput} from '@dynatrace/strato-components-preview/forms';
import {mergeProps} from '@react-aria/utils';
import './list-filters.css'

type MappingProps = {
  children: ReactElement;
  /** state control props - controlled version */
  onChange?: (value: unknown) => void;
  value?: unknown;
  /** state control props - uncontrolled version */
  defaultValue?: unknown;
};

/** Returns wrapper component for mapping select-specific props to props required by FilterBar.Item */
const Mapper = (props: MappingProps) => {
  const { children, defaultValue } = props;
  const { defaultSelectedId } = children.props;
  const handleChange = (val: string) => {
    props.onChange?.(val);
  };
  return cloneElement(children, {
    ...mergeProps(children.props, {
      value: defaultSelectedId || defaultValue,
      onChange: handleChange,
    }),
  });
};

interface MonitorTypeOption {
  id: string;
  displayName: string;
}

const monitorTypeOptions: Array<MonitorTypeOption> = [
  { id: 'ALL', displayName: 'All' },
  { id: 'BROWSER', displayName: 'Browser' },
  { id: 'HTTP', displayName: 'HTTP' },
];

export const ListFilters = ({ onFiltersChanged }: { onFiltersChanged: (appliedFilters: FilterItemValues) => void }): JSX.Element => {

  const defaultFilterState = {
    type: { value: ['ALL'] },
    assignedApps: { value: '' },
    tag: { value: '' },
    location: { value: '' },
    name: { value: '' },
  };

  return (
      <div className="filter-bar">
        <FilterBar onFilterChange={onFiltersChanged}>
          <FilterBar.Item name="type" label="Type">
            <Mapper defaultValue={defaultFilterState.type.value}>
              <Select
                defaultSelectedId={defaultFilterState.type.value}
                name="type"
                id="type-select"
              >
                {monitorTypeOptions.map((type: MonitorTypeOption) => (
                  <SelectOption key={type.id} id={type.id}>
                    {type.displayName}
                  </SelectOption>
                ))}
              </Select>
            </Mapper>
          </FilterBar.Item>
          <FilterBar.Item name="name" label="Name">
            <TextInput placeholder={'Provide monitor name'} defaultValue={defaultFilterState.name.value} />
          </FilterBar.Item>
          <FilterBar.Item name="assignedApps" label="Application">
            <TextInput placeholder={'Provide an application id'} defaultValue={defaultFilterState.assignedApps.value} />
          </FilterBar.Item>
          <FilterBar.Item name="tag" label="Tag">
            <TextInput placeholder={'Provide a tag'} defaultValue={defaultFilterState.tag.value} />
          </FilterBar.Item>
          <FilterBar.Item name="location" label="Location">
            <TextInput placeholder={'Provide a location id'} defaultValue={defaultFilterState.location.value} />
          </FilterBar.Item>
        </FilterBar>
      </div>
  );
}