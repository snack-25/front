'use client';

import React from 'react';

interface StatusModalProps {
  status: 'approved' | 'rejected';
  title: string;
  message: string;
  buttonLeft: string;
  buttonRight: string;
  onClose: () => void;
  onNavigate: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  status,
  title,
  message,
  buttonLeft,
  buttonRight,
  onClose,
  onNavigate,
}) => {
  const imageSrc =
    status === 'approved'
      ? '/img/modal/approved-md.svg'
      : '/img/modal/rejected-md.svg';

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center'>
        <img
          src={imageSrc}
          alt={status}
          className='mx-auto w-28 h-28 mb-4'
        />
        <h2 className='text-xl font-bold mb-2'>{title}</h2>
        <p className='text-gray-500 whitespace-pre-line mb-6'>{message}</p>
        <div className='flex justify-between gap-3'>
          <button
            onClick={onClose}
            className='w-1/2 py-2 rounded-lg bg-orange-50 text-orange-500 font-semibold'
          >
            {buttonLeft}
          </button>
          <button
            onClick={onNavigate}
            className='w-1/2 py-2 rounded-lg bg-orange-500 text-white font-semibold'
          >
            {buttonRight}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
