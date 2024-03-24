import { Slider } from '../ui/slider';
import { FormControl, FormItem, FormLabel } from '../ui/form';

interface RangeProps {
  label?: string;
  value?: number;
  onChange?(value: number): void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Range = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  className
}: RangeProps) => (
  <FormItem className={className}>
    {label && (
      <FormLabel>
        {label}: <span className="inline-block w-8">{value}</span>
      </FormLabel>
    )}
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
