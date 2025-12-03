'use client';

import { DatePicker, Input, InputNumber, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { FilterType, FilterOperator, IFilterSchema, IFilterValue } from '../../core/types';
import { isMultipleValueOperator } from '../../core/operators';
import { RelationControl } from '../RelationControl';

export interface IFilterValueControlProps {
  schema: IFilterSchema | null;
  value: IFilterValue;
  onChange: (value: unknown) => void;
}

export const FilterValueControl = ({
  schema,
  value: filterValue,
  onChange,
}: IFilterValueControlProps) => {
  if (!schema || !filterValue) {
    return <Input disabled value="No value" style={{ width: 100 }} variant="borderless" />;
  }

  const { operator, value, type } = filterValue;
  const isMultiple = isMultipleValueOperator(operator);

  // Date type
  if (type === FilterType.Date || type === FilterType.DateRange) {
    if (operator === FilterOperator.Between) {
      const rangeValue = Array.isArray(value) && value.length === 2
        ? value as [Dayjs | null, Dayjs | null]
        : [null, null] as [Dayjs | null, Dayjs | null];

      return (
        <DatePicker.RangePicker
          format="MM-DD-YYYY"
          variant="borderless"
          autoFocus
          style={{ width: 220 }}
          value={rangeValue}
          onChange={(dates) => onChange(dates || [])}
        />
      );
    }

    return (
      <DatePicker
        format="MM-DD-YYYY"
        variant="borderless"
        autoFocus
        style={{ width: 120 }}
        value={Array.isArray(value) ? value?.[0] : value}
        onChange={(v) => onChange(v ? [v] : [])}
      />
    );
  }

  // Price/Number type
  if (type === FilterType.Price || type === FilterType.Number || type === FilterType.Integer) {
    return (
      <InputNumber
        autoFocus
        variant="borderless"
        style={{ width: 100 }}
        value={(Array.isArray(value) ? value?.[0] : value) || 0}
        onChange={(v) => onChange(v !== null ? [v] : [])}
      />
    );
  }

  // Relation type
  if (type === FilterType.Relation && schema.entity) {
    return (
      <RelationControl
        entity={schema.entity}
        value={value}
        onChange={onChange}
        isMultiple={isMultiple}
        variant="borderless"
      />
    );
  }

  // Enum type or any type with options
  if (schema.options?.length) {
    return (
      <Select
        options={schema.options.map((opt) => ({
          label: opt.label,
          value: opt.value as string | number,
        }))}
        placeholder="Select..."
        value={value}
        onChange={onChange}
        mode={isMultiple ? 'multiple' : undefined}
        variant="borderless"
        style={{ minWidth: 100 }}
      />
    );
  }

  // Boolean type
  if (type === FilterType.Boolean) {
    return (
      <Select
        options={[
          { label: 'True', value: true },
          { label: 'False', value: false },
        ]}
        placeholder="Select..."
        value={Array.isArray(value) ? value?.[0] : value}
        onChange={(v) => onChange([v])}
        variant="borderless"
        style={{ minWidth: 80 }}
      />
    );
  }

  // Default: String input
  return (
    <Input
      autoFocus
      variant="borderless"
      placeholder="Type here..."
      style={{ width: 120 }}
      value={Array.isArray(value) ? value?.[0] : value}
      onChange={(e) => {
        const v = e.target.value?.trim?.();
        onChange(v ? [v] : []);
      }}
    />
  );
};
