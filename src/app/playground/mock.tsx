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
  // 추가된 snack - pie 데이터
  {
    companyId: 'company-2',
    productId: 'choco-pie',
    productImage: '/img/card/item-coke-zero.png',
    productName: '초코파이',
    price: 3000,
    parentId: 'snack',
    categoryId: 'pie',
    purchase: 50,
  },
  {
    companyId: 'company-2',
    productId: 'custard-pie',
    productImage: '/img/card/item-coke-zero.png',
    productName: '카스타드 파이',
    price: 3200,
    parentId: 'snack',
    categoryId: 'pie',
    purchase: 45,
  },
  {
    companyId: 'company-2',
    productId: 'apple-pie',
    productImage: '/img/card/item-coke-zero.png',
    productName: '애플파이',
    price: 3500,
    parentId: 'snack',
    categoryId: 'pie',
    purchase: 40,
  },
  {
    companyId: 'company-2',
    productId: 'sweet-potato-pie',
    productImage: '/img/card/item-coke-zero.png',
    productName: '고구마 파이',
    price: 2800,
    parentId: 'snack',
    categoryId: 'pie',
    purchase: 55,
  },
];
