import { IProducts } from "@/app/productList/page"
import { cn } from "@/lib/utils";

interface IData {
  products : IProducts[];
}

export default function EntryList({products}:IData) {
  return (
    <div className='flex flex-col'>
            {products.map((data) => (
              <div
                key={data.id}
                className='flex items-center justify-between px-20 max-lt:px-6 bg-background-400 lt:h-[104px] border-b-1 border-line-200'
              >
                <div></div>
                {Object.entries(data)
                  .filter(([key]) => key !== 'productId')
                  .map(([key, value]) => (
                    <span
                      key={`${data.name}-${key}`}
                      className={cn(
                        'lt:text-xl max-lt:text-md text-black-100 font-medium',
                        key === 'productName'
                          ? 'font-semibold text-black-200'
                          : '',
                        key === 'productLink'
                          ? 'overflow-ellipsis max-w-[166px]'
                          : '',
                      )}
                    >
                      {key === 'time' ? value.toLocaleDateString() : value}
                    </span>
                  ))}
              </div>
            ))}
          </div>
  )
}