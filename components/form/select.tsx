import React, { ForwardedRef, SelectHTMLAttributes } from 'react';

interface SelectOption extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  value: string;
}

const Select = React.forwardRef(
  (
    {
      label,
      options,
      ...rest
    }: {
      label?: string;
      options: SelectOption[];
    },
    ref: ForwardedRef<HTMLSelectElement>
  ) => (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <select ref={ref} className="select select-bordered" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
);

Select.displayName = 'Select';

export default Select;
