interface CustomTooltipProps {
  content: string;
}

const CustomTooltip = ({ content }: CustomTooltipProps) => {
  return (
    <div className='grid place-items-center'>
      <div
        className='
      bg-primary-400
      text-white
      whitespace-nowrap
      font-bold
      tb:text-[26px]
      text-xs
      rounded-full
      py-1.5
      px-2.5
      lt:py-5
      lt:px-8
      '
      >
        {content}
      </div>
      <span className='block'>
        <svg
          className='fill-primary-400 block w-3 h-2 lt:w-full lt:h-full'
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
