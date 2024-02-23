import React, { ForwardedRef, InputHTMLAttributes } from 'react';

interface RangeProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Range = React.forwardRef(
  (
    { label, name, min, max, step, ...rest }: RangeProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        className="range"
        {...rest}
      />
    </label>
  )
);

Range.displayName = 'Range';

export default Range;
