import React, { ForwardedRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef(
  ({ label, ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) => (
    <label className="form-control w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <input
        ref={ref}
        placeholder="Type here"
        className="input input-bordered w-full"
        {...rest}
      />
    </label>
  )
);

Input.displayName = 'Input';

export default Input;
