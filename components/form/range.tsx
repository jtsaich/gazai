import { Slider } from '../ui/slider';
import { FormControl, FormItem, FormLabel } from '../ui/form';

interface RangeProps {
  label?: string;
  value?: number;
  onChange?(value: number): void;
  min?: number;
  max?: number;
  step?: number;
}

const Range = ({ label, value, onChange, min, max, step }: RangeProps) => (
  <FormItem>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Slider
        defaultValue={value ? [value] : undefined}
        onValueChange={(val) => {
          onChange?.(val[0]);
        }}
        min={min}
        max={max}
        step={step}
      />
    </FormControl>
  </FormItem>
);

export default Range;
