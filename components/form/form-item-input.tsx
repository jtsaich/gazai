import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

interface FormIemInputProps {
  label?: string;
}

const FormItemInput = ({ label, ...rest }: FormIemInputProps) => (
  <FormItem>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Input {...rest} />
    </FormControl>
  </FormItem>
);

export default FormItemInput;
