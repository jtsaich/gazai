import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
}

const Input = <T extends FieldValues>({
  label,
  name,
  register,
  ...rest
}: InputProps<T>) => (
  <label className="form-control w-full max-w-xs">
    {label && (
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
    )}
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered w-full max-w-xs"
      {...register(name)}
      {...rest}
    />
  </label>
);

export default Input;
