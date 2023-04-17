import React, { useCallback, useMemo } from 'react';
import type { MonitorCollectionElement } from '@dynatrace-sdk/client-classic-environment-v1';
import {
  Button,
  DataTable,
  Flex,
  LoadingIndicator,
  TableColumn,
  TableVariantConfig,
  Text,
} from '@dynatrace/strato-components-preview';

interface MonitorListProps {
  monitors?: MonitorCollectionElement[];
  isLoading: boolean;
  selectedForPreview: string | null;
  onSelectedForPreviewChange: (id: string) => void;
  onSelectedForEditChange: (ids: string[]) => void;
  onPageChange: (pageSize: number, pageIndex: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export const MonitorList = (props: MonitorListProps) => {
  const {
    monitors,
    selectedForPreview,
    onSelectedForPreviewChange,
    onSelectedForEditChange,
    isLoading,
    onPageChange,
    pageSize,
    onPageSizeChange,
  } = props;
  const onSelectedForPreviewHandler = useCallback(
    (event) => {
      onSelectedForPreviewChange(event.currentTarget.dataset.id);
    },
    [onSelectedForPreviewChange],
  );

  /** table columns configuration */
  const columns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Monitor name',
        id: 'name',
        accessor: 'name',
        columnType: 'text',
        ratioWidth: 4,
        cell: ({ value, row }) => {
          const entityId = row.original.entityId;
          const color = entityId === selectedForPreview ? 'primary' : 'neutral';
          return (
            <Button color={color} data-id={entityId} onClick={onSelectedForPreviewHandler}>
              {value}
            </Button>
          );
        },
        lineWrap: true,
      },
      {
        header: 'Type',
        id: 'type',
        accessor: (row) => (row.type === 'BROWSER' ? 'Browser' : row.type),
        columnType: 'text',
        ratioWidth: 1,
      },
    ],
    [onSelectedForPreviewHandler, selectedForPreview],
  );

  const rowSelectionChangedHandler = (data: Array<MonitorCollectionElement>) => {
    onSelectedForEditChange(data.map((item) => item.entityId));
  };

  const tableVariant: TableVariantConfig = {
    rowDensity: 'default',
    rowSeparation: 'horizontalDividers',
    verticalDividers: false,
    contained: true,
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return monitors !== undefined && monitors.length > 0 ? (
    <DataTable
      columns={columns}
      data={monitors}
      sortable
      selectableRows
      sortBy={{ id: 'name', desc: false }}
      variant={tableVariant}
      onRowSelectionChange={rowSelectionChangedHandler}
    >
      <DataTable.Pagination pageSize={pageSize} onPageSizeChange={onPageSizeChange} onPageChange={onPageChange} />
    </DataTable>
  ) : (
    <Flex paddingTop={8}>
      <Text textStyle='base-emphasized'>No monitors found.</Text>
    </Flex>
  );
};
