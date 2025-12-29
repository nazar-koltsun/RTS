const DownloadIcon = ({
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
      <path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z"></path>
    </svg>
  );
};

export default DownloadIcon;

