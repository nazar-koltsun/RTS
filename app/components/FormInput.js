import { cn } from '@/lib/utils';
import styles from '@/app/components/FormInput.module.css';

export default function FormInput({
  type = 'text',
  id,
  label,
  value,
  onChange,
  required = false,
  className = '',
  placeholder = '',
  ...props
}) {
  return (
    <div className={cn(styles.inputWrapper)}>
      <label className={styles.label} htmlFor={id}>
        {label} 
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      <input
        className={styles.input}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
