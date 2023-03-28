import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Button,
    Flex,
    LoadingIndicator,
    Modal,
    OverlayContainer,
    TitleBar,
    useContainerBreakpoint,
} from '@dynatrace/strato-components-preview';
import {MonitorList} from './monitor-list';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import {Grid} from '@dynatrace/strato-components-preview/layouts-core';
import {ListFilters} from './list-filters';
import {MonitorConfigPreview} from './monitor-config-preview';
import {FilterItemValues} from '@dynatrace/strato-components-preview/filters';
import {
    MonitorCollectionElement,
} from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/monitor-collection-element';
import {Monitors, syntheticMonitorsClient} from '@dynatrace-sdk/client-classic-environment-v1';
import {BulkUpdateModal} from '../bulk-update/bulk-update-modal';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Borders from '@dynatrace/strato-design-tokens/borders';
import styled from 'styled-components';
import {defaultPreviewHeightFactor} from "../../utils/constants";
import {Text} from "@dynatrace/strato-components-preview/typography";

const StyledWrapper = styled.div`
  color: ${Colors.Text.Neutral.Default};
  background: ${Colors.Theme.Background[20]};
  border-radius: ${Borders.Radius.Container.Default};
  padding: ${Spacings.Size8};
  padding-right: ${Spacings.Size20};
  text-decoration: "none";
  display: "block";
`;

interface MonitorsQueryConfig {
  type?: string;
  assignedApps?: string[];
  tag?: string[];
  location?: string;
}

export const Home = (): JSX.Element => {
  const [filterItemValues, setFilterItemValues] = useState<FilterItemValues | null>(null);
  const [filteredMonitors, setFilteredMonitors] = useState<MonitorCollectionElement[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(true);
  const [selectedForPreview, setSelectedForPreview] = useState<string | null>(null);
  const [selectedForEdit, setSelectedForEdit] = useState<string[]>([]);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const twoColumns = useContainerBreakpoint('(min-width: 840px)', containerRef);
  const getGridTemplateAreas = () => {
    return twoColumns ? `'filters filters' 'selected selected' 'list config'` : `'filters filters' 'selected selected' 'list list' 'config config'`;
  }
  /** fetching monitors and server side filtering logic */
  const filtersChangedHandler = (filterItemValues: FilterItemValues) => {
    setFilterItemValues(filterItemValues);
  };

  const fetchIdRef = useRef(0);

  const compareMonitorNames = () => {
    return (a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    };
  }

  const fetchMonitors = useCallback(() => {
    setIsListLoading(true);
    const fetchId = ++fetchIdRef.current;
    const queryConfig: MonitorsQueryConfig = {};
    if (filterItemValues) {
      Object.entries(filterItemValues).forEach(([key, { value }]) => {
        if (key === 'type') {
          const filterValues = value as string[];
          queryConfig[key] = filterValues[0] !== 'ALL' ? filterValues[0] : undefined;
        } else if (key === 'location') {
          const filterValue = value as string;
          queryConfig[key] = filterValue?.length > 0 ? filterValue : undefined;
        } else {
          const filterValue = value as string;
          queryConfig[key] = filterValue?.length > 0 ? [filterValue] : undefined;
        }
      })
    }
    if (fetchId === fetchIdRef.current) {
      syntheticMonitorsClient.getMonitorsCollection(queryConfig)
        .then((response: Monitors) => {
          if (fetchId === fetchIdRef.current) {
            let textToSearch = ''
            if (filterItemValues) {
              textToSearch = typeof filterItemValues['name']?.value === 'string' ? filterItemValues['name'].value : '';
            }
            const monitors = response.monitors
                .filter(monitor => monitor.name.toLowerCase().includes(textToSearch.toLowerCase()))
                .sort(compareMonitorNames());
            setIsListLoading(false);
            setFilteredMonitors(monitors);
            setSelectedForPreview(monitors[0].entityId)
          }
        });
    }
  }, [filterItemValues]);

  useEffect(() => {
    /** used debouncing to prevent querying API on every keystroke in filter inputs */
    const timeoutId = setTimeout(() => {
      fetchMonitors();
    }, 800);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [fetchMonitors]);

  function getHeight() {
    return defaultPreviewHeightFactor * (pageSize + 1);
  }

  function countMonitors(): string {
    return selectedForEdit.length === 1 ? 'monitor' : 'monitors';
  }

  return (
    <StyledWrapper ref={containerRef}>
      <Flex gap={16} flexDirection="column">
        <TitleBar>
          <TitleBar.Title>Synthetic monitors</TitleBar.Title>
          <TitleBar.Suffix>
            <Flex flexDirection={"row"} alignItems={"baseline"}>
              {selectedForEdit.length > 0 && <Text>{selectedForEdit.length} {countMonitors()} selected</Text>}
              <Button variant="accent" onClick={() => setShowFormModal(true)} disabled={selectedForEdit.length === 0}>
                Edit
              </Button>
            </Flex>
          </TitleBar.Suffix>
        </TitleBar>
        <Grid
          width="100%"
          gridTemplateColumns="repeat(2, 1fr);"
          gridTemplateAreas={getGridTemplateAreas()}
          gap={24}
        >
          <Grid gridItem gridArea="filters">
            <Flex flexDirection={"row"} alignItems={"baseline"} >
              <ListFilters onFiltersChanged={filtersChangedHandler}/>
              <LoadingIndicator loading={isListLoading}></LoadingIndicator>
            </Flex>
          </Grid>
          <Grid gridItem key="list" gridArea="list">
            <MonitorList
              monitors={filteredMonitors}
              isLoading={isListLoading}
              selectedForPreview={selectedForPreview}
              setSelectedForPreview={setSelectedForPreview}
              setSelectedForEdit={setSelectedForEdit}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </Grid>
          <Grid gridItem key="config" gridArea="config">
            {filteredMonitors.length > 0 && (
                <MonitorConfigPreview monitorId={selectedForPreview} height={getHeight()}/>
            )}
          </Grid>
        </Grid>
        <OverlayContainer>
          <Modal title="Bulk update" size="medium" dismissible show={showFormModal} onDismiss={() => setShowFormModal(false)}>
            <BulkUpdateModal selectedIds={selectedForEdit} showFormHandler={setShowFormModal} setSelectedForPreview={setSelectedForPreview} />
          </Modal>
        </OverlayContainer>
      </Flex>
    </StyledWrapper>
  );
};