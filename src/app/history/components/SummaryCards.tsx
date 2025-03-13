import { Card, CardContent , CardHeader , CardTitle } from "@/components/ui/cards";
//api 나오면 바꿔라!! 신혜야!!

const SummaryCards = () => {
  return (
    <div className={'grid grid-cols-1  md:grid-cols-3'}>
      <Card className={'w-[402] h-[210]'}>
        <CardHeader>
          <CardTitle className={'text-[24px]'}>이번 달 지출액</CardTitle>
          <p className={'text-gray-400'}>지난 달: 2,000,000원</p>
        </CardHeader>
        <CardContent>
          
          <p className={'text-[32px] font-bold'}>126,0000원</p>
        </CardContent>
      </Card>

      <Card className={'w-[402] h-[210]'}>
        <CardHeader>
          <CardTitle className={'text-[24px]'}>이번 달 지출액</CardTitle>
          <p className={'text-gray-400'}>지난 달: 2,000,000원</p>
        </CardHeader>
        <CardContent>
          
          <p className={'text-[32px] font-bold'}>126,0000원</p>
        </CardContent>
      </Card>

      <Card className={'w-[402] h-[210]'}>
        <CardHeader>
          <CardTitle className={'text-[24px]'}>이번 달 지출액</CardTitle>
          <p className={'text-gray-400'}>지난 달: 2,000,000원</p>
        </CardHeader>
        <CardContent>
          
          <p className={'text-[32px] font-bold'}>126,0000원</p>
        </CardContent>
      </Card>
    </div>
  );

};

export default SummaryCards;