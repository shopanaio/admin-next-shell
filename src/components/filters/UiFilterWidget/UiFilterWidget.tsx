'use client';

import { Flex, Badge, Button, Card, Dropdown, Input, Tag, Typography } from 'antd';
import { FilterOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UiFilter } from '@/entity/UiFilter';
import { IFiltersProps } from './useUiFilters';
import { findFilter } from './utils';
import { UiFilterValueControl } from './UiFilterValueControl';
import { useStyles, cardBodyStyle } from './styles';

export interface ISearchProps {
  onChangeSearchValue: (value: string) => void;
  searchValue: string;
}

export interface IUiFilterWidgetProps {
  filtersProps: IFiltersProps;
  searchProps: ISearchProps;
}

export const UiFilterWidget = ({
  filtersProps,
  searchProps,
}: IUiFilterWidgetProps) => {
  const { styles } = useStyles();
  const { onChange, options, value } = filtersProps;

  const [nestedOptions, setNestedOptions] = useState<UiFilter.IUiFilter[]>([]);
  const [open, setOpen] = useState(false);

  const update = useCallback(
    (idx: number, nextValue: UiFilter.IUiFilterValue) => {
      onChange([...value.slice(0, idx), nextValue, ...value.slice(idx + 1)]);
    },
    [value, onChange],
  );

  useEffect(() => {
    if (!open) {
      setNestedOptions([]);
    }
  }, [open]);

  const properties = useMemo(() => {
    const opts = nestedOptions?.length
      ? nestedOptions.at(-1)?.children || []
      : options;

    return [...opts].sort((a, b) => {
      if (typeof a.label === 'string' && typeof b.label === 'string') {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });
  }, [options, nestedOptions]);

  const renderRow = (record: UiFilter.IUiFilter) => {
    return (
      <div
        className={styles.row}
        key={record.key}
        onClick={() => {
          if (record.children?.length) {
            setNestedOptions([...nestedOptions, record]);
            return;
          }

          setOpen(false);
          onChange([
            ...value,
            {
              entity: record.entity,
              label: typeof record.label === 'string' ? record.label : record.key,
              operator: record.operators[0],
              type: record.type,
              keyPath: nestedOptions?.length
                ? [...nestedOptions.map((it) => it.key), record.key]
                : [record.key],
              payloadKey: record.payloadKey,
              value: [],
            },
          ]);
        }}
      >
        <div>
          <Button type="text" className={styles.filterLabelButton}>
            {record.label}
            {!!record.children?.length && <RightOutlined />}
          </Button>
        </div>
        <div>
          <Typography.Text type="secondary">
            {record.description}
          </Typography.Text>
        </div>
      </div>
    );
  };

  const renderFilterValue = useCallback(
    (it: UiFilter.IUiFilterValue, idx: number) => {
      const condition = findFilter(it?.keyPath || [], options);

      const operatorButton = (
        <Button
          shape="round"
          size="small"
          onClick={(e) => e.stopPropagation()}
        >
          {UiFilter.operators[it?.operator]?.literal || '?'}
        </Button>
      );

      return (
        <Badge
          key={it.payloadKey || idx}
          count={
            <div
              onClick={() => {
                onChange(value.filter((_, i) => i !== idx));
              }}
              role="button"
              className={styles.filterCloseBadge}
            >
              <CloseOutlined style={{ fontSize: 10 }} />
            </div>
          }
        >
          <div
            className={styles.filterNode}
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.filterNodeLeft}>
              <Typography.Text ellipsis>{it.label}</Typography.Text>
            </div>
            <div className={styles.filterNodeCenterWrapper}>
              <div className={styles.filterNodeCenter}>
                {(condition?.operators || []).length > 1 ? (
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: condition?.operators.map((op) => {
                        const opData = UiFilter.operators[op];
                        return {
                          key: opData.value,
                          icon: <Tag className={styles.operatorTag}>{opData.literal}</Tag>,
                          label: opData.label,
                          onClick: () => {
                            update(idx, { ...value[idx], operator: op });
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
              <div className={styles.filterNodeRight}>
                <UiFilterValueControl
                  filter={condition}
                  value={it}
                  onChange={(nextValue) => {
                    update(idx, { ...value[idx], value: nextValue });
                  }}
                />
              </div>
            </div>
          </div>
        </Badge>
      );
    },
    [onChange, options, value, update, styles],
  );

  return (
    <Flex gap="small" align="center" style={{ width: '100%' }}>
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <Card styles={{ body: cardBodyStyle }}>
            {!!nestedOptions?.length && (
              <Flex style={{ marginBottom: 'var(--x4)' }} gap="small" vertical>
                <Typography.Text strong>Connections</Typography.Text>
                <Flex gap="small" wrap="wrap">
                  {nestedOptions.map((it, idx) => (
                    <Tag
                      key={it.key}
                      closable
                      onClose={() => setNestedOptions(nestedOptions.slice(0, idx))}
                      className={styles.breadcrumbTag}
                    >
                      {it.label}
                    </Tag>
                  ))}
                </Flex>
              </Flex>
            )}
            <div>
              <div className={styles.header}>
                <Typography.Text strong>Name</Typography.Text>
                <Typography.Text strong>Description</Typography.Text>
              </div>
              {properties.map(renderRow)}
            </div>
          </Card>
        )}
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setOpen(false);
        }}
      >
        <div className={styles.widgetContainer}>
          <Button
            onClick={() => setOpen(true)}
            icon={<FilterOutlined />}
            disabled={!options?.length}
          >
            Filter
          </Button>
          {value.map((it, idx) => renderFilterValue(it, idx))}
          <Input
            className={styles.searchInput}
            data-node-type="ui-filter-search"
            variant="borderless"
            placeholder="Type to search..."
            value={searchProps.searchValue}
            onChange={({ target }) => {
              searchProps.onChangeSearchValue(target.value);
            }}
          />
        </div>
      </Dropdown>
    </Flex>
  );
};
