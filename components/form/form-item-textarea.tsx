import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormIemTextareaProps {
  label?: string;
  className?: string;
}

const FormItemTextarea = ({
  label,
  className,
  ...rest
}: FormIemTextareaProps) => (
  <FormItem className={className}>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Textarea {...rest} />
    </FormControl>
  </FormItem>
);

export default FormItemTextarea;
