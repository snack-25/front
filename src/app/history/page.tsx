import HistoryTable from "./components/HistoryTable";
import SummaryCards from "./components/SummaryCards";
import DropdownMenu, { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/Dropdown-Menu";

const OrdersPage = () => {
  return (
    <div className={"w-full px-8 lg:px-16 pt-10 pb-10"}>
      <div className={"w-full h-[114px] flex justify-between items-center"}>
        <h1 className={"text-[42px] font-bold"}>구매 내역 확인</h1>
      </div>
      <div className={"space-y-6"}>
        <SummaryCards />
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[136px] h-[50px] btn text-gray-500 text-left pl-[14px] border-2 bg-gray-50 rounded-sm">최신순</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"text-gray-500"}>
              <DropdownMenuItem>최신순</DropdownMenuItem>
              <DropdownMenuItem>높은금액순</DropdownMenuItem>
              <DropdownMenuItem>낮은금액순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <HistoryTable />
      </div>
    </div>
  );
};

export default OrdersPage;