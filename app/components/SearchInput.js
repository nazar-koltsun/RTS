import SearchIcon from '@/app/components/icons/SearchIcon';
import styles from './SearchInput.module.css';

const SearchInput = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  className,
  isDisabled = false,
  iconFill = '#757575',
  iconWidth = 24,
  iconHeight = 24,
}) => {
  return (
    <div className={`${styles.searchInputWrapper} ${className || ''}`}>
      <SearchIcon
        className={styles.searchIcon}
        width={iconWidth}
        height={iconHeight}
        fill={iconFill}
      />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SearchInput;

