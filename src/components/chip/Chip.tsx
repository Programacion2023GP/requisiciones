type ChipType = {
  message: string;
  className: string;
};
const Chip: React.FC<ChipType> = ({ message, className }) => {
  return (
    <div
      className={ `mx-2 center relative inline-block select-none whitespace-nowrap rounded-lg  py-2 px-2 align-baseline font-sans text-xs font-bold uppercase leading-none text-white  ${className}`}
    >
      <div className="">{message}</div>
    </div>
  );
};
export default Chip;
