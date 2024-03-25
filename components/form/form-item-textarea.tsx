import React from 'react';

import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormIemTextareaProps {
  label?: string;
  className?: string;
}

const FormItemTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormIemTextareaProps
>(({ label, className, ...rest }, ref) => (
  <FormItem className={className}>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Textarea ref={ref} {...rest} />
    </FormControl>
  </FormItem>
));
FormItemTextarea.displayName = 'FormItemTextarea';

export default FormItemTextarea;
