import React from 'react';

import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Input, InputProps } from '../ui/input';

interface FormItemInputProps extends InputProps {
  label?: string;
  className?: string;
}

const FormItemInput = React.forwardRef<HTMLInputElement, FormItemInputProps>(
  ({ label, className, ...rest }, ref) => (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input ref={ref} {...rest} />
      </FormControl>
    </FormItem>
  )
);

FormItemInput.displayName = 'FormItemInput';

export default FormItemInput;
