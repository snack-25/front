import { useState } from 'react';
import { Search, XCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TextIconProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearable?: boolean; // X 버튼 활성화 여부
}

const TextIcon: React.FC<TextIconProps> = ({
  placeholder = '검색어를 입력하세요',
  value = '',
  onChange,
  clearable = true,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className='relative w-full'>
      {/* 왼쪽 아이콘 (돋보기) */}
      <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
        <Search size={18} />
      </span>

      {/* Input 필드 */}
      <Input
        type='text'
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (onChange) {onChange(e);}
        }}
        className={cn(
          'pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500',
        )}
      />

      {/* 오른쪽 X 버튼 (입력값 지우기) */}
      {clearable && inputValue && (
        <button
          type='button'
          onClick={handleClear}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default TextIcon;
