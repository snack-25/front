export interface IProducts {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  imageUrl: string;
  totalSold: number;
}

export interface PaginatedProductList {
  items: IProducts[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const baseProducts: IProducts[] = Array.from({ length: 20 }, (_, i) => ({
  id: `mock-${i + 1}`,
  name: `상품 ${i + 1}`,
  price: 1000 + i * 123,
  description: `상품 ${i + 1}에 대한 설명입니다.`,
  categoryId: '임시입니다',
  imageUrl: 'https://placehold.co/600x400?text=tmp',
  totalSold: 0,
}));

export function getMockProductPage(page: number): PaginatedProductList {
  const limit = 6;
  const total = baseProducts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    items: baseProducts.slice(start, end),
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
