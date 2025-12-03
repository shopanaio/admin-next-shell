import { UiFilter } from '@/entity/UiFilter';
import { useState } from 'react';

interface IUseUiFiltersProps {
  filters: UiFilter.IUiFilter[];
}

export interface IFiltersProps {
  options: UiFilter.IUiFilter[];
  value: UiFilter.IUiFilterValue[];
  onChange: (value: UiFilter.IUiFilterValue[]) => void;
  reset: () => void;
}

export const useUiFilters = ({ filters }: IUseUiFiltersProps): IFiltersProps => {
  const [value, setValue] = useState<UiFilter.IUiFilterValue[]>([]);

  const onChange = (value: UiFilter.IUiFilterValue[]) => {
    setValue(value);
  };

  const reset = () => {
    setValue([]);
  };

  return {
    options: filters,
    onChange,
    value,
    reset,
  };
};
