import { SelectHTMLAttributes } from 'react';

import { FormControl, FormItem, FormLabel } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

interface SelectOption extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  value: string;
}

const FormItemSelect = ({
  label,
  options,
  value,
  onChange,
  className
}: {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?(value: string): void;
  className?: string;
}) => (
  <FormItem className={className}>
    {label && <FormLabel>{label}</FormLabel>}
    <Select onValueChange={onChange} defaultValue={value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select one" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormItem>
);
export default FormItemSelect;
