import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormIemTextareaProps {
  label?: string;
}

const FormItemInput = ({ label, ...rest }: FormIemTextareaProps) => (
  <FormItem>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Textarea {...rest} />
    </FormControl>
  </FormItem>
);

export default FormItemInput;
