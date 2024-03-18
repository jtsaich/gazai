import { ForwardedRef, InputHTMLAttributes } from 'react';
import { Slider } from '../ui/slider';
import { FormControl, FormItem, FormLabel } from '../ui/form';

interface RangeProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Range = ({ label, value, min, max, step }: RangeProps) => (
  <FormItem>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Slider defaultValue={[value]} min={min} max={max} step={step} />
    </FormControl>
  </FormItem>
);

export default Range;
