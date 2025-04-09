import { Category } from '@/components/gnb/TabMenu';

export function getCategoryNamePair(
  categories: Category[],
  childCategoryId: string,
): { parentName: string; childName: string } {
  const child = categories.find((c) => c.id === childCategoryId);
  const parent = categories.find((c) => c.id === child?.parentId);

  return {
    parentName: parent?.name || '상위 카테고리',
    childName: child?.name || '하위 카테고리',
  };
}
