import { Card, CardContent , CardHeader , CardTitle } from "@/components/ui/cards";
//api 나오면 바꿔라!! 신혜야!!

const SummaryCards = () => {
  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle>이번 달 지출액</CardTitle>
        </CardHeader>
        <CardContent>
          <p>지난 달: 2,000,000원</p>
          <p>126,0000원</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>이번 달 남은 예산</CardTitle>
        </CardHeader>
        <CardContent>
          <p>지난 달보다 50,000원 더 많아요</p>
          <p>126,0000원</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>올해 총 지출액</CardTitle>
        </CardHeader>
        <CardContent>
          <p>지난 해보다 1,000,000원 더 지출했어요</p>
          <p>126,0000원</p>
        </CardContent>
      </Card>
    </div>
  );

};

export default SummaryCards;