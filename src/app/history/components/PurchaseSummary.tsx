interface PurchaseSummaryProps {
  totalItems: number;
  totalAmount: number;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  totalItems,
  totalAmount,
}) => {
  return (
    <div className='flex justify-between items-center mt-4 px-4'>
      <p className='text-gray-600'>총 {totalItems}건</p>
      <p className='text-orange-600 font-bold text-lg'>
        {totalAmount.toLocaleString()}원
      </p>
    </div>
  );
};

export default PurchaseSummary;
