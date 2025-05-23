import Image from 'next/image';

interface Item {
  id: number;
  image: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface PurchaseItemListProps {
  items: Item[];
}

const PurchaseItemList: React.FC<PurchaseItemListProps> = ({ items }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4 h-[400px] overflow-y-auto'>
      {items.map((item) => (
        <div
          key={item.id}
          className='flex items-center gap-4 border-b py-4'
        >
          <Image
            src={item.image}
            alt={item.name}
            width={50}
            height={50}
          />
          <div className='flex-1'>
            <p className='text-sm text-gray-600'>정량 · 단위상품</p>
            <p className='font-semibold'>{item.name}</p>
            <p className='text-sm text-gray-500'>수량: {item.quantity}개</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-500'>
              {item.price.toLocaleString()}원
            </p>
            <p className='font-bold'>{item.total.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchaseItemList;
