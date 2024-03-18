import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormIemTextareaProps {
  label?: string;
}

const FormItemTextarea = ({ label, ...rest }: FormIemTextareaProps) => (
  <FormItem>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Textarea {...rest} />
    </FormControl>
  </FormItem>
);

export default FormItemTextarea;
