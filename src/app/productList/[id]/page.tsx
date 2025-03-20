// 'use client';
// import { IProps, mockData, parentId } from '@/app/playground/mock';
// import TabMenu from '@/components/gnb/TabMenu';
// import { useParams, useSearchParams } from 'next/navigation';
// import { ChevronRight } from 'lucide-react';
// import Image from 'next/image';
// import NumberInput from '@/components/ui/NumberInput';
// import { Button } from '@/components/ui/Button';
// import ProductMenu from '@/components/productList/ProductMenu';

// const items = mockData;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const item = items.find((item) => item.productId === id);

//   const { productImage, productName, price, purchase, parentId, categoryId } =
//     item || {};

//   const maincategory = categories[parentId as TMain].kor;
//   const subCategory = categories[parentId as TMain].items.find(
//     (item) => item.eng === categoryId,
//   )?.kor;

//   return (
//     <>
//       <TabMenu />
//       <div className='relative flex flex-col my-6 w-full lt:px-[120px] max-lt:px-6'>
//         <div className='flex text-gray-400 text-xl font-medium gap-2 mb-6'>
//           <div>홈</div>
//           <ChevronRight className='text-gray-300' />
//           <div>{maincategory}</div>
//           <ChevronRight className='text-gray-300' />
//           <div className='text-black-400'>{subCategory}</div>
//         </div>

//         <div className='relative w-full flex gap-20 max-tb:gap-6 max-tb:flex-col'>
//           <div className='relative bg-white w-1/2 max-tb:w-full aspect-square rounded-2xl flex items-center justify-center'>
//             <div className='absolute w-1/2 h-1/2'>
//               <Image
//                 src={productImage as string}
//                 fill
//                 className='object-contain'
//                 alt='product image'
//               />
//             </div>
//           </div>

//           <div className='flex flex-col gap-8 w-1/2 max-tb:w-full  '>
//             <div className='flex justify-between'>
//               <div>
//                 <p className='lt:text-xl max-lt:text-xs font-medium text-gray-500 mb-2'>
//                   {subCategory}
//                 </p>
//                 <h1 className='lt:text-3xl max-lt:text-2xl font-semibold text-black-400 mb-6'>
//                   {productName}
//                 </h1>
//                 <p className='bg-illustration-02 lt:text-xl max-lt:text-xs font-semibold mb-6 text-orange-400 text-center py-1 w-[98px] h-[40px] max-lt:w-[62px] max-lt:h-6'>
//                   {purchase}회 구매
//                 </p>
//                 <p className='lt:text-3xl max-lt:text-2xl font-bold text-black-400 mb-6'>
//                   {price}원
//                 </p>
//               </div>
//               <ProductMenu />
//             </div>

//             <div className='flex flex-col w-full gap-2 lt:text-xl max-lt:text-md border-y-1 border-gray-200 py-8'>
//               <p className='flex gap-6'>
//                 <span className='text-black-400 font-medium'>구매 혜택</span>
//                 <span className='text-black-100 font-medium'>
//                   5포인트 적립 예정
//                 </span>
//               </p>
//               <p className='flex gap-6'>
//                 <span className='text-black-400 font-medium'>배송방법</span>
//                 <span className='text-black-100 font-medium'>택배</span>
//               </p>
//               <p className='flex gap-6'>
//                 <span className='text-black-400 font-medium'>배송비</span>
//                 <span className='text-black-100 font-medium'>
//                   3,000원(50,000원 이상 무료 배송)
//                 </span>
//               </p>
//             </div>
//             <div className='flex w-full gap-6'>
//               <NumberInput className='lt:w-[200px] max-lt:w-[118px]' />
//               {/* 추후에 prop 삽입 필요 */}
//               <Button
//                 variant='outline'
//                 className='border-1 bg-primary-400 text-white w-full cursor-pointer transition-opacity duration-300 hover:opacity-80'
//               >
//                 장바구니 담기
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
