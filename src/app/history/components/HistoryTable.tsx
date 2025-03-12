import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
//api 나오면 바꿔라!! 신혜야!!

const HistoryTable = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>구매승인일</TableHead>
            <TableHead>상품정보</TableHead>
            <TableHead>주문 금액</TableHead>
            <TableHead>요청인</TableHead>
            <TableHead>담당자</TableHead>
            <TableHead>구매요청일일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2024.07.04</TableCell>
            <TableCell>코카콜라 제로 외 1건</TableCell>
            <TableCell>21,000</TableCell>
            <TableCell>김철수</TableCell>
            <TableCell>이영희</TableCell>
            <TableCell>2024.07.04</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>2024.07.04</TableCell>
            <TableCell>코카콜라 제로 외 1건</TableCell>
            <TableCell>21,000</TableCell>
            <TableCell>김철수</TableCell>
            <TableCell>이영희</TableCell>
            <TableCell>2024.07.04</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>2024.07.04</TableCell>
            <TableCell>코카콜라 제로 외 1건</TableCell>
            <TableCell>21,000</TableCell>
            <TableCell>김철수</TableCell>
            <TableCell>이영희</TableCell>
            <TableCell>2024.07.04</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
