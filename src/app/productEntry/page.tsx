import { SortDropDown } from "@/components/productList/SortDropDown";
import { entryMock } from "../playground/entryMock"

const headList:string[] = ['등록일','상품명','카테고리','가격','제품 링크'];

export default function ProductEntry() {
  const data = entryMock;

  return (
    <>
    <div className="flex flex-col px-[120px] max-lt:px-6 w-full lt:py-10 max-lt:py-[14px]">
      <div className="flex items-center justify-between pb-10">
        <h1 className="lt:text-3xl max-lt:text-xl font-semibold text-black-400">상품 등록 내역</h1>
        <SortDropDown />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="max-lt:hidden flex items-center justify-around text-black-100 text-xl font-medium bg-gray-50 h-20 rounded-full border-1 border-gray-200">
          {
            headList.map((elem)=> 
            <span>{elem}</span>)
          }
        </h1>
        
        <div>렌더링 부분</div>
      </section>
    </div>
    </>
  )
}