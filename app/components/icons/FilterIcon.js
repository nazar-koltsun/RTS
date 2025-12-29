const FilterIcon = ({
  width = 24,
  height = 24,
  fill = '#65676e',
  className,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      focusable="false"
      aria-hidden="true"
    >
      <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path>
    </svg>
  );
};

export default FilterIcon;

