interface CustomTooltipProps {
  content: string;
}

const CustomTooltip = ({ content }: CustomTooltipProps) => {
  return (
    <div className='grid place-items-center'>
      <div className='bg-primary-400 text-white font-bold text-[26px] rounded-full py-5 px-8 whitespace-nowrap'>
        {content}
      </div>
      <span className='block'>
        <svg
          className='fill-primary-400 block'
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
