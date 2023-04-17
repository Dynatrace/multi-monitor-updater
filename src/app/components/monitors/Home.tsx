import React, { useMemo, useState } from 'react';
import { Button, Flex, Heading, Modal, FilterItemValues, Grid } from '@dynatrace/strato-components-preview';
import { MonitorList } from './MonitorList';

import { ListFilters } from './ListFilters';
import { MonitorConfigPreview } from './MonitorConfigPreview';
import { BulkUpdateModal } from '../bulk-update/BulkUpdateModal';
import { useMonitorsCollection } from './useMonitorsCollection';
import { SelectedMonitorsChip } from '../SelectedMonitorsChip';

export const Home = () => {
  const [filterItemValues, setFilterItemValues] = useState<FilterItemValues>({
    name: {
      value: '',
    },
  });

  const [selectedForPreview, setSelectedForPreview] = useState<string | null>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<string[]>([]);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const height = pageSize * 50 + 75;

  // fetch the monitors from the backend and selecting the first monitor
  // when the fetch was successful
  const { data: monitors, isLoading } = useMonitorsCollection(filterItemValues, (data) => {
    const firstMonitor = data.at(0);
    setSelectedForPreview(firstMonitor ? firstMonitor.entityId : null);
  });

  // Filter the fetched monitors by name provided on the client
  const filteredMonitors = useMemo(
    () =>
      monitors?.filter((monitor) =>
        monitor.name
          .toLocaleLowerCase()
          .includes(((filterItemValues.name.value as string | undefined) || '').toLocaleLowerCase()),
      ),
    [monitors, filterItemValues.name.value],
  );

  // Better: Adjust the state while rendering
  const [prevFilteredMonitors, setPrevFilteredMonitors] = useState(filteredMonitors);
  if (filteredMonitors !== prevFilteredMonitors) {
    setPrevFilteredMonitors(filteredMonitors);
    setSelectedForPreview(filteredMonitors?.at(0)?.entityId ?? '');
  }

  /** fetching monitors and server side filtering logic */
  function filtersChangedHandler(filterItemValues: FilterItemValues) {
    setFilterItemValues(filterItemValues);
  }

  return (
    <Flex flexDirection='column' gap={16}>
      <Flex flexDirection={'row'} justifyContent={'space-between'} flexGrow={1}>
        <Heading as='h2' level={4}>
          Synthetic monitors
        </Heading>
        <Flex flexDirection={'row'} alignItems={'baseline'}>
          <SelectedMonitorsChip monitors={selectedForEdit} />
          <Button
            color='primary'
            variant='accent'
            onClick={() => setShowFormModal(true)}
            disabled={selectedForEdit.length === 0}
          >
            Edit
          </Button>
        </Flex>
      </Flex>
      <ListFilters onFiltersChanged={filtersChangedHandler} />
      <Grid gridTemplateColumns='repeat(auto-fit, minmax(600px, 1fr));'>
        <MonitorList
          monitors={filteredMonitors}
          isLoading={isLoading}
          selectedForPreview={selectedForPreview}
          onSelectedForPreviewChange={setSelectedForPreview}
          onSelectedForEditChange={setSelectedForEdit}
          onPageChange={() => setSelectedForEdit([])}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <Flex maxHeight={height}>
          {selectedForPreview ? <MonitorConfigPreview monitorId={selectedForPreview} /> : null}
        </Flex>
      </Grid>
      <Modal
        title='Bulk update'
        size='small'
        dismissible
        show={showFormModal}
        onDismiss={() => setShowFormModal(false)}
      >
        <Flex flexDirection='column' gap={16}>
          <BulkUpdateModal selectedIds={selectedForEdit} onDismiss={() => setShowFormModal(false)} />
        </Flex>
      </Modal>
    </Flex>
  );
};
