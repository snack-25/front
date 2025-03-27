'use client';
import { useCustomToast } from '@/components/ui/Toast/Toast';

export default function PlayGround() {
  return (
    <>
      <div>
        <button
          onClick={() => {
            useCustomToast({ label: '예산이 변경되었습니다.' });
          }}
        >
          토스트 띄우기
        </button>
      </div>
    </>
  );
}
