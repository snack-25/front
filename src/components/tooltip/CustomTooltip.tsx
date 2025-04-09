interface CustomTooltipProps {
  content: string;
}

const CustomTooltip = ({ content }: CustomTooltipProps) => {
  return (
    <div className='place-items-center grid'>
      <div
        className='
      bg-primary-400
      text-white
      whitespace-nowrap
      font-bold
      max-lt:text-[16px]
      tb:text-[20px]
      text-[26px]
      rounded-full
      py-1.5
      px-2.5
      lt:py-4
      lt:px-7
      '
      >
        {content}
      </div>
      <span className='block'>
        <svg
          className='fill-primary-400 lt:w-full lt:h-full block w-3 h-2'
          width='32'
          height='26'
          viewBox='0 0 30 10'
          preserveAspectRatio='none'
        >
          <polygon points='0,0 30,0 15,10'></polygon>
        </svg>
      </span>
    </div>
  );
};

export default CustomTooltip;
