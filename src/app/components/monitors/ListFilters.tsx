import React, { useState } from 'react';
import { FilterBar, FilterItemValues } from '@dynatrace/strato-components-preview/filters';
import { SelectV2, SelectV2SingleValue, TextInput } from '@dynatrace/strato-components-preview/forms';

const monitorTypeOptions = [
  { id: 'ALL', displayName: 'All' },
  { id: 'BROWSER', displayName: 'Browser' },
  { id: 'HTTP', displayName: 'HTTP' },
] as const;

type ListFilterProps = {
  onFiltersChanged: (appliedFilters: FilterItemValues) => void;
};


export const ListFilters = ({ onFiltersChanged }: ListFilterProps) => {
  const handleSelectChange = (value: SelectV2SingleValue<string | undefined>) => {
    setSelectedValue(value === null || value === 'ALL' ? undefined : value);
  };
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  return (
    <FilterBar onFilterChange={onFiltersChanged}>
      <FilterBar.Item name='type' label='Type'>
        <SelectV2 value={selectedValue ?? 'ALL'} onChange={handleSelectChange} name='type' id='type-select' >
          <SelectV2.Trigger width='90px' />
          <SelectV2.Content width='105px'>
            {monitorTypeOptions.map((type) => (
              <SelectV2.Option key={type.id} value={type.id}>
                {type.displayName}
              </SelectV2.Option>
            ))}
          </SelectV2.Content>
        </SelectV2>
      </FilterBar.Item>
      <FilterBar.Item name='name' label='Name'>
        <TextInput placeholder={'Provide monitor name'} />
      </FilterBar.Item>
      <FilterBar.Item name='assignedApps' label='Application'>
        <TextInput placeholder={'Provide an application id'} />
      </FilterBar.Item>
      <FilterBar.Item name='tag' label='Tag'>
        <TextInput placeholder={'Provide a tag'} />
      </FilterBar.Item>
      <FilterBar.Item name='location' label='Location'>
        <TextInput placeholder={'Provide a location id'} />
      </FilterBar.Item>
    </FilterBar>
  );
};
