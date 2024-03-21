import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Input, InputProps } from '../ui/input';

interface FormIemInputProps extends InputProps {
  label?: string;
  className?: string;
}

const FormItemInput = ({ label, className, ...rest }: FormIemInputProps) => (
  <FormItem className={className}>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl>
      <Input {...rest} />
    </FormControl>
  </FormItem>
);

export default FormItemInput;
