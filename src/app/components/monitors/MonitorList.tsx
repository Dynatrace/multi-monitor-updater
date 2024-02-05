import React, { useCallback, useMemo } from 'react';
import type { MonitorCollectionElement } from '@dynatrace-sdk/client-classic-environment-v1';
import {
  Button,
  DataTable,
  Flex, Skeleton,
  TableColumn,
  TableVariantConfig,
  Text,
} from '@dynatrace/strato-components-preview';
import { FormattedMessage } from 'react-intl';

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

  const rowSelectionChangedHandler = (selectedRows: Record<string, boolean> ,data: Array<MonitorCollectionElement>) => {
    onSelectedForEditChange(data.map((item) => item.entityId));
  };

  const tableVariant: TableVariantConfig = {
    rowDensity: 'default',
    rowSeparation: 'horizontalDividers',
    verticalDividers: false,
    contained: true,
  };

  return monitors !== undefined && monitors.length > 0 ? (
    <DataTable loading={isLoading}
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
    <>
      {isLoading ? (
        <Skeleton height={50} />
      ) : (
        <Flex paddingTop={8}>
          <Text textStyle='base-emphasized'>
            <FormattedMessage
              defaultMessage='No monitors found.'
              id="Ic+DUPiBbG29qe+8"
            />
          </Text>
        </Flex>
      )}
    </>
  );
};
