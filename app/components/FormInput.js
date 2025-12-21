import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from '@/app/components/FormInput.module.css';

const FormInput = forwardRef(function FormInput(
  {
    type = 'text',
    id,
    label,
    value,
    onChange,
    required = false,
    className = '',
    placeholder = '',
    invalid = false,
    showEditBtn = false,
    onEditBtnClick,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div
      className={cn(styles.inputWrapper, invalid && styles.invalid, className)}
    >
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      <input
        ref={ref}
        className={cn(
          styles.input,
          showEditBtn && styles.inputWithEditBtn,
          isPassword && styles.inputWithPasswordToggle
        )}
        type={inputType}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          className={styles.passwordToggleBtn}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15"><path fill="#5C677D" d="M12.148 5.969a3.5 3.5 0 0 1-4.68 4.68l.768-.768a2.5 2.5 0 0 0 3.145-3.145l.767-.767zM5.82 12.297c.993.47 2.052.703 3.18.703 3.13 0 5.732-1.788 7.856-5.5-.837-1.463-1.749-2.628-2.738-3.501l.708-.708C15.994 4.337 17.052 5.74 18 7.5c-2.333 4.333-5.333 6.5-9 6.5a8.294 8.294 0 0 1-3.926-.957l.746-.746zM15.89.813L2.313 14.39a.5.5 0 0 1-.667-.744L3.393 11.9C2.138 10.837 1.007 9.37 0 7.5 2.333 3.167 5.333 1 9 1c1.51 0 2.907.367 4.19 1.102L15.147.146a.5.5 0 0 1 .744.667zm-3.436 2.026A7.315 7.315 0 0 0 9 2C5.87 2 3.268 3.788 1.144 7.5c.9 1.572 1.884 2.798 2.959 3.69l1.893-1.893a3.5 3.5 0 0 1 4.801-4.801l1.657-1.657zm-2.396 2.395a2.5 2.5 0 0 0-3.324 3.324l3.324-3.324z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13"><path fill="#5C677D" d="M9 12c3.13 0 5.732-1.788 7.856-5.5C14.732 2.788 12.13 1 9 1S3.268 2.788 1.144 6.5C3.268 10.212 5.87 12 9 12zM9 0c3.667 0 6.667 2.167 9 6.5-2.333 4.333-5.333 6.5-9 6.5s-6.667-2.167-9-6.5C2.333 2.167 5.333 0 9 0zm0 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>
          )}
        </button>
      )}
      {showEditBtn && (
        <button
          type="button"
          className={styles.editBtn}
          onClick={onEditBtnClick}
          aria-label="Edit"
        >
          Edit
        </button>
      )}
    </div>
  );
});

export default FormInput;
