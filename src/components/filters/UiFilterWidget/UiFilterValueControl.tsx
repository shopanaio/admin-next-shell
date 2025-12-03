import { UiFilter } from '@/entity/UiFilter';
import { DatePicker, Input, InputNumber, Select } from 'antd';

const { UiFilterType } = UiFilter;

export interface UiFilterValueControlProps {
  value: UiFilter.IUiFilterValue;
  onChange: (value: any | any[]) => void;
  filter: UiFilter.IUiFilter | null;
}

export const UiFilterValueControl = ({
  value: valueProp,
  onChange,
  filter,
}: UiFilterValueControlProps) => {
  if (!filter || !valueProp) {
    return <Input disabled value="No value" style={{ width: 100 }} />;
  }

  const { operator, value, type } = valueProp;

  const isMultiple = [
    UiFilter.UiFilterOperator.In,
    UiFilter.UiFilterOperator.NotIn,
  ].includes(operator);

  if (type === UiFilterType.Date) {
    if (operator === UiFilter.UiFilterOperator.Between) {
      return (
        <DatePicker.RangePicker
          format="MM-DD-YYYY"
          variant="borderless"
          autoFocus
          style={{ width: 220 }}
          value={value}
          onChange={onChange}
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

  if (type === UiFilterType.Price || type === UiFilterType.Number) {
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

  if (filter?.options?.length) {
    return (
      <Select
        options={filter.options}
        placeholder="Select..."
        value={value}
        onChange={onChange}
        mode={isMultiple ? 'multiple' : undefined}
        variant="borderless"
        style={{ minWidth: 100 }}
      />
    );
  }

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
