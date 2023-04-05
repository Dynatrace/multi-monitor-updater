import React, {Fragment, useCallback, useMemo} from 'react';
import {
    MonitorCollectionElement,
} from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/monitor-collection-element';
import Colors from '@dynatrace/strato-design-tokens/colors';
import {DataTable, TableColumn, TableVariantConfig, useCurrentTheme} from '@dynatrace/strato-components-preview';
import {Text} from '@dynatrace/strato-components-preview/typography';
import "./monitor-list.css"

interface MonitorListProps {
    monitors: MonitorCollectionElement[];
    isLoading: boolean;
    selectedForPreview: string | null;
    setSelectedForPreview: (id: string) => void;
    setSelectedForEdit: (ids: string[]) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    onPageChange: (pageSize: number, pageIndex: number) => void;

}

export const MonitorList = (props: MonitorListProps): JSX.Element => {
    const {
        monitors,
        isLoading,
        selectedForPreview,
        setSelectedForPreview,
        setSelectedForEdit,
        pageSize,
        onPageSizeChange,
        onPageChange
    } = props;
    const onSelectedForPreviewHandler = useCallback((event) => {
        setSelectedForPreview(event.target.dataset.id);
    }, [setSelectedForPreview]);

    /** table columns configuration */
    const columns = useMemo<TableColumn[]>(
        () =>
            [
                {
                    header: 'Monitor name',
                    id: 'name',
                    accessor: 'name',
                    columnType: 'text',
                    ratioWidth: 4,
                    cell: ({value, row}) => {
                        const entityId = row.original.entityId;
                        const color = entityId === selectedForPreview ?
                            Colors.Text.Primary.Default : Colors.Text.Neutral.Default;
                        return <Text style={{cursor: 'pointer', color}}
                                     data-id={entityId}
                                     onClick={onSelectedForPreviewHandler}>{value}</Text>;
                    },
                    lineWrap: true,
                },
                {
                    header: 'Type',
                    id: 'type',
                    accessor: (row) => row.type === 'BROWSER' ? 'Browser' : row.type,
                    columnType: 'text',
                    ratioWidth: 1,
                },
            ],
        [onSelectedForPreviewHandler, selectedForPreview]
    );

    const rowSelectionChangedHandler = (data: Array<{ original: MonitorCollectionElement }>) => {
        setSelectedForEdit(data.map(item => item.original.entityId));
    };

    const theme = useCurrentTheme();

    const tableVariant: TableVariantConfig = {
        rowDensity: 'default',
        rowSeparation: 'horizontalDividers',
        verticalDividers: false,
        contained: false,
    };

    return (
        (<Fragment>
            {monitors.length > 0 && (
                <div className={"monitors-datatable-" + theme}>
                    <DataTable
                        columns={columns}
                        data={monitors}
                        sortable
                        selectableRows
                        sortBy={{id: 'name', desc: false}}
                        variant={tableVariant}
                        onRowSelectionChange={rowSelectionChangedHandler}
                    >
                        <DataTable.Pagination pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange}/>
                    </DataTable>
                </div>
            )}
            {!isLoading && monitors.length === 0 && (
                <Text textStyle="default-emphasized" style={{padding: '8px 0'}}>
                    No monitors found.
                </Text>
            )}
        </Fragment>)
    );
}