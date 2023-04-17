import React from 'react';
import { FilterBar, FilterItemValues } from '@dynatrace/strato-components-preview/filters';
import { Select, SelectOption, TextInput } from '@dynatrace/strato-components-preview/forms';
import { Mapper } from '../helpers/Mapper';

const monitorTypeOptions = [
  { id: 'ALL', displayName: 'All' },
  { id: 'BROWSER', displayName: 'Browser' },
  { id: 'HTTP', displayName: 'HTTP' },
] as const;

type ListFilterProps = {
  onFiltersChanged: (appliedFilters: FilterItemValues) => void;
};

export const ListFilters = ({ onFiltersChanged }: ListFilterProps) => {
  return (
    <FilterBar onFilterChange={onFiltersChanged}>
      <FilterBar.Item name='type' label='Type'>
        <Mapper defaultValue={['ALL']}>
          <Select defaultSelectedId={['ALL']} name='type' id='type-select'>
            {monitorTypeOptions.map((type) => (
              <SelectOption key={type.id} id={type.id}>
                {type.displayName}
              </SelectOption>
            ))}
          </Select>
        </Mapper>
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
