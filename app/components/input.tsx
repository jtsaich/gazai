import React, { ForwardedRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef(
  ({ label, ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) => (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <input
        ref={ref}
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        {...rest}
      />
    </label>
  )
);

Input.displayName = 'Input';

export default Input;
