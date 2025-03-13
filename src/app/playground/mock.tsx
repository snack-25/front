export type parentId = 'snack' | 'drink' | 'water' | 'simpleFood' | 'equipment';

export interface IProps {
  companyId: string;
  productId: string;
  productImage: string;
  productName: string;
  price: number;
  parentId: parentId;
  categoryId: string;
  purchase: number;
}

export const mockData: IProps[] = [
  {
    companyId: 'company-1',
    productId: 'coke-zero',
    productImage: '/img/card/item-coke-zero.png',
    productName: '코카콜라 제로',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'coke-classic',
    productImage: '/img/card/item-coke-zero.png',
    productName: '코카콜라',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'fanta-orange',
    productImage: '/img/card/item-coke-zero.png',
    productName: '환타 오렌지',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'sprite',
    productImage: '/img/card/item-coke-zero.png',
    productName: '스프라이트',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'coke-zero-2',
    productImage: '/img/card/item-coke-zero.png',
    productName: '코카콜라 제로',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'coke-classic-2',
    productImage: '/img/card/item-coke-zero.png',
    productName: '코카콜라',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'fanta-orange-2',
    productImage: '/img/card/item-coke-zero.png',
    productName: '환타 오렌지',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
  {
    companyId: 'company-1',
    productId: 'sprite-2',
    productImage: '/img/card/item-coke-zero.png',
    productName: '스프라이트',
    price: 2000,
    parentId: 'drink',
    categoryId: 'soda',
    purchase: 29,
  },
];
