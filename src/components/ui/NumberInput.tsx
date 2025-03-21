import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value = 1,
  onChange,
  min = 1, // ✅ 최소 선택량은 1개로 정했습니다! 다른 아이템에 맞게 수정해주시면되요~
  max = 100, // ✅ 임의로 최대 선택량은 100개로 정했습니다! 다른 아이템에 맞게 수정해주시면되요~
  step = 1,
  className,
}) => {
  const [inputValue, setInputValue] = useState<number>(value);

  const handleIncrease = () => {
    if (inputValue < max) {
      const newValue = inputValue + step;
      setInputValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleDecrease = () => {
    if (inputValue > min) {
      const newValue = inputValue - step;
      setInputValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div
      className={cn(
        className,
        'relative flex items-center justify-end border-2 border-orange-400 rounded-lg px-4 py-2 text-orange-500',
      )}
    >
      {/* 숫자 표시 */}
      <span className='text-lg font-medium'>{inputValue} 개</span>

      {/* 버튼 컨테이너 */}
      <div className='flex flex-col ml-2'>
        <button
          type='button'
          onClick={handleIncrease}
          className='text-orange-400 hover:text-orange-500'
        >
          <ChevronUp size={16} />
        </button>
        <button
          type='button'
          onClick={handleDecrease}
          className='text-orange-400 hover:text-orange-500'
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
