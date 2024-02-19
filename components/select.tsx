import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

const Select = <T extends FieldValues>({
  label,
  name,
  options,
  register
}: {
  label?: string;
  name: Path<T>;
  options: SelectOption[];
  register: UseFormRegister<T>;
}) => (
  <label className="form-control w-full max-w-xs">
    {label && (
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
    )}
    <select className="select select-bordered" {...register(name)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export default Select;
