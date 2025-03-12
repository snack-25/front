import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// 📌 임시 더미 데이터~ API 나오면 수정해야함
const mockOrders = [
  { id: 1, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "이영희", requestDate: "2024.07.04" },
  { id: 2, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "이영희", requestDate: "2024.07.04" },
  { id: 3, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "이영희", requestDate: "2024.07.04" },
  { id: 100, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "하쉐리리", requestDate: "2024.07.04" },
  { id: 101, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "하쉐리리", requestDate: "2024.07.04" },
  { id: 102, date: "2024.07.04", product: "코카콜라 제로 외 1건", price: "21,000", requester: "김철수", handler: "하쉐리리", requestDate: "2024.07.04" }
];

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
            <TableHead>구매요청일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.price}원</TableCell>
              <TableCell>{order.requester}</TableCell>
              <TableCell>{order.handler}</TableCell>
              <TableCell>{order.requestDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;

