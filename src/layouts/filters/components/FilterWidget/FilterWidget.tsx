'use client';

import { useCallback, useMemo, useState } from 'react';
import { Flex, Badge, Button, Card, Dropdown, Input, Tag, Typography } from 'antd';
import { FilterOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { IFilterSchema, IFilterValue } from '../../core/types';
import { operatorsMeta } from '../../core/operators';
import { findFilter } from '../../utils/findFilter';
import { FilterValueControl } from './FilterValueControl';
import { useStyles, cardBodyStyle } from './styles';

export interface IFilterWidgetSearchProps {
  searchValue: string;
  onChangeSearchValue: (value: string) => void;
}

export interface IFilterWidgetProps {
  /** Available filter schemas */
  options: IFilterSchema[];
  /** Current filter values */
  value: IFilterValue[];
  /** Callback when filters change */
  onChange: (value: IFilterValue[]) => void;
  /** Search props (optional) */
  searchProps?: IFilterWidgetSearchProps;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Label for filter button */
  filterButtonLabel?: string;
}

export const FilterWidget = ({
  options,
  value,
  onChange,
  searchProps,
  searchPlaceholder = 'Type to search...',
  filterButtonLabel = 'Filter',
}: IFilterWidgetProps) => {
  const { styles } = useStyles();
  const [nestedPath, setNestedPath] = useState<IFilterSchema[]>([]);
  const [open, setOpen] = useState(false);

  // Update a filter at specific index
  const updateFilter = useCallback(
    (index: number, updates: Partial<IFilterValue>) => {
      onChange([
        ...value.slice(0, index),
        { ...value[index], ...updates },
        ...value.slice(index + 1),
      ]);
    },
    [value, onChange],
  );

  // Remove filter and focus search input
  const removeFilter = useCallback(
    (index: number) => {
      const searchInput = document?.querySelector(
        'input[data-node-type="filter-search"]',
      ) as HTMLInputElement;
      searchInput?.focus();
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  // Handle dropdown open state change
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) return;
    setOpen(false);
    setNestedPath([]);
  }, []);

  // Get current options based on nested path
  const currentOptions = useMemo(() => {
    const opts = nestedPath.length
      ? nestedPath[nestedPath.length - 1]?.children || []
      : options;

    return [...opts].sort((a, b) => {
      if (typeof a.label === 'string' && typeof b.label === 'string') {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });
  }, [options, nestedPath]);

  // Render a filter option row
  const renderOptionRow = (schema: IFilterSchema) => {
    return (
      <div
        className={styles.row}
        key={schema.key}
        onClick={() => {
          // If has children, navigate into
          if (schema.children?.length) {
            setNestedPath([...nestedPath, schema]);
            return;
          }

          // Otherwise, add the filter
          setOpen(false);
          const newFilter: IFilterValue = {
            schemaKey: schema.key,
            entity: schema.entity,
            label: typeof schema.label === 'string' ? schema.label : schema.key,
            operator: schema.operators[0],
            type: schema.type,
            keyPath: nestedPath.length
              ? [...nestedPath.map((s) => s.key), schema.key]
              : [schema.key],
            payloadKey: schema.payloadKey,
            value: [],
          };
          onChange([...value, newFilter]);
        }}
      >
        <div>
          <Button type="text" className={styles.filterLabelButton}>
            {schema.label}
            {!!schema.children?.length && <RightOutlined style={{ fontSize: 12 }} />}
          </Button>
        </div>
        <div>
          <Typography.Text type="secondary">{schema.description}</Typography.Text>
        </div>
      </div>
    );
  };

  // Render an active filter value
  const renderFilterValue = useCallback(
    (filter: IFilterValue, index: number) => {
      const schema = findFilter(filter.keyPath || [], options);

      const operatorButton = (
        <Button
          shape="round"
          size="small"
          onClick={(e) => e.stopPropagation()}
        >
          {operatorsMeta[filter.operator]?.literal || '?'}
        </Button>
      );

      return (
        <Badge
          key={filter.payloadKey || index}
          data-node-type="filter-close-badge"
          count={
            !filter.fixed && (
              <div
                onClick={() => removeFilter(index)}
                role="button"
                data-remove-tag
                className={styles.filterCloseBadge}
              >
                <CloseOutlined style={{ fontSize: 10 }} />
              </div>
            )
          }
        >
          <div
            data-node-type="filter-tag"
            className={styles.filterNode}
            tabIndex={0}
            role="button"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.currentTarget === e.target && e.key === 'Backspace') {
                removeFilter(index);
              }
            }}
          >
            <div className={styles.filterNodeLeft}>
              <Typography.Text ellipsis>{filter.label}</Typography.Text>
            </div>
            <div className={styles.filterNodeCenterWrapper}>
              <div className={styles.filterNodeCenter}>
                {(schema?.operators || []).length > 1 ? (
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: schema?.operators.map((op) => {
                        const opMeta = operatorsMeta[op];
                        return {
                          key: opMeta.value,
                          icon: <Tag className={styles.operatorTag}>{opMeta.literal}</Tag>,
                          label: opMeta.label,
                          onClick: () => {
                            updateFilter(index, { operator: op });
                          },
                        };
                      }),
                    }}
                  >
                    {operatorButton}
                  </Dropdown>
                ) : (
                  operatorButton
                )}
              </div>
              <div data-value-node className={styles.filterNodeRight}>
                <FilterValueControl
                  schema={schema}
                  value={filter}
                  onChange={(nextValue) => {
                    updateFilter(index, { value: nextValue });
                  }}
                />
              </div>
            </div>
          </div>
        </Badge>
      );
    },
    [options, updateFilter, removeFilter, styles],
  );

  // Handle search input keydown for backspace navigation
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !searchProps?.searchValue) {
        const prevNode = e.currentTarget.previousElementSibling as HTMLElement;
        if (prevNode?.dataset?.nodeType === 'filter-close-badge') {
          prevNode?.querySelector<HTMLElement>('[data-node-type="filter-tag"]')?.focus();
        }
      }
    },
    [searchProps?.searchValue],
  );

  return (
    <Flex gap="small" align="center" style={{ width: '100%' }}>
      <Dropdown
        trigger={['click']}
        popupRender={() => (
          <Card styles={{ body: cardBodyStyle }}>
            {/* Breadcrumb for nested navigation */}
            {!!nestedPath.length && (
              <Flex style={{ marginBottom: 'var(--x4)', paddingLeft: 'var(--x2)' }} gap="small" vertical>
                <Typography.Text strong>Connections</Typography.Text>
                <Flex gap="small" wrap="wrap">
                  {nestedPath.map((schema, idx) => (
                    <Tag
                      key={schema.key}
                      closable
                      onClose={() => setNestedPath(nestedPath.slice(0, idx))}
                      className={styles.breadcrumbTag}
                    >
                      {schema.label}
                    </Tag>
                  ))}
                </Flex>
              </Flex>
            )}

            {/* Options list */}
            <div>
              <div className={styles.header}>
                <Typography.Text strong>Name</Typography.Text>
                <Typography.Text strong>Description</Typography.Text>
              </div>
              {currentOptions.map(renderOptionRow)}
            </div>
          </Card>
        )}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <div className={styles.widgetContainer}>
          <Button
            onClick={() => setOpen(true)}
            icon={<FilterOutlined />}
            disabled={!options?.length}
          >
            {filterButtonLabel}
          </Button>

          {/* Active filters */}
          {value.map((filter, idx) => renderFilterValue(filter, idx))}

          {/* Search input */}
          {searchProps && (
            <Input
              className={styles.searchInput}
              data-node-type="filter-search"
              variant="borderless"
              placeholder={searchPlaceholder}
              value={searchProps.searchValue}
              onChange={({ target }) => {
                searchProps.onChangeSearchValue(target.value);
              }}
              onKeyDown={handleSearchKeyDown}
            />
          )}
        </div>
      </Dropdown>
    </Flex>
  );
};
