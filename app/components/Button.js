import styles from '@/app/components/Button.module.css';
import { cn } from '@/lib/utils';

export default function Button({ children, onClick, className, disabled, ...props }) {
  return (
    <button className={cn(styles.button, className)} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
}