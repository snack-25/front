import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'md' | 'sm'; // ✅ md가 기본입니다! sm은 작은 사이즈입니다.
  minLength?: number; // ✅ 최소 입력 글자 수입니다. 8자 이상 입력해야합니다.
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = 'md', minLength = 8, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(props.value || '');

    // React의 useState는 초기값만 반영하고, 이후 props.value가 변경되더라도 자동으로 업데이트되지 않음
    // 사용자가 Textarea에 값을 입력하면 setInputValue가 실행되지만,
    // 부모가 값이 변경되어서 리랜더링할때, 자식한테 값을 전달해도 setInputValue가 실행되지 않음
    // 이때(부모가 리랜더링 할 때), React는 자식 컴포넌트에서 변경 사항이 없다고 판단하여 자식 렌더링을 건너뜀
    // 이로 인해 빨간 경고문을 체크하지 못해 경고문이 사라지지 않는 문제가 발생함
    // 따라서 useEffect를 사용하여 props.value가 변경될 때마다 inputValue를 동기화함
    React.useEffect(() => {
      setInputValue(props.value || '');
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      if (props.onChange) {props.onChange(e);}
    };

    return (
      <div className='flex flex-col gap-1 w-full'>
        <textarea
          ref={ref}
          className={cn(
            'border rounded-lg p-3 transition-all focus:ring-2 focus:ring-blue-500',
            size === 'sm' ? 'h-24 text-sm' : 'h-40 text-base',
            className,
          )}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        {String(inputValue).length < minLength && (
          <p className='text-sm text-red-500'>
            최소 {minLength}자 이상 입력해야 합니다.
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
