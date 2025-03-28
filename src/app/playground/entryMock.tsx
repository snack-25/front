export const mockProductHistory = Array.from({ length: 20 }, (_, i) => {
  const date = new Date('2025-03-28');
  date.setDate(date.getDate() - i); // 0~19일 전

  const categoryList = ['스낵', '음료', '라면', '과자', '디저트'];
  const productNames = [
    '신라면 컵',
    '초코파이',
    '코카콜라',
    '포카칩',
    '삼양라면',
    '참깨라면',
    '레쓰비',
    '바나나킥',
    '오징어땅콩',
    '나쵸',
    '초코송이',
    '페퍼로니 피자',
    '환타 오렌지',
    '허니버터칩',
    '빼빼로',
    '에너지바',
    '마이쮸',
    '비타500',
    '감자깡',
    '칠성사이다',
  ];

  return {
    id: `mock-${i + 1}`,
    createdAt: date.toISOString().split('T')[0],
    name: productNames[i],
    categoryId: `cat-${categoryList[i % categoryList.length]}`,
    description: `${productNames[i]}에 대한 설명입니다.`,
    price: 1000 + i * 123,
    imageUrl: 'https://placehold.co/600x400?text=tmp', // 예시 이미지 경로
    link: 'https://www.codeit.kr',
  };
});
