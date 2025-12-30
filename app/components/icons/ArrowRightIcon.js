const ArrowRightIcon = ({
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
      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
    </svg>
  );
};

export default ArrowRightIcon;

