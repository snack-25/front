import { ImageIcon,XCircle } from 'lucide-react';
import { useState } from 'react';

interface ProfileUploaderProps {
  onChange?: (file: File | null) => void;
}

const ProfileUploader: React.FC<ProfileUploaderProps> = ({ onChange }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className='relative w-32 h-32 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100'>
      {image ? (
        <>
          <img
            src={image}
            alt='Uploaded'
            className='w-full h-full object-cover'
          />
          <button
            type='button'
            onClick={handleRemoveImage}
            className='absolute top-1 right-1 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-500'
          >
            <XCircle size={20} />
          </button>
        </>
      ) : (
        <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer'>
          <ImageIcon
            size={32}
            className='text-gray-400'
          />
          <span className='text-xs text-gray-500 mt-1'>이미지 업로드</span>
          <input
            type='file'
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      )}
    </div>
  );
};

export default ProfileUploader;
