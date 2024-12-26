import { BuyMonthlyData, RentMonthlyData } from '@/utils/calculations';
import { formatCurrency } from '@/utils/visualizations';

interface DataTableProps {
  buyData: BuyMonthlyData[];
  rentData: RentMonthlyData[];
}

const DataTable = ({ buyData, rentData }: DataTableProps) => {
  return (
    <div className="relative rounded-md border">
      <div className="overflow-x-auto overflow-y-auto max-h-[650px]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-gray-950 z-20">
            <tr>
              <th className="py-3 px-4 text-left font-medium sticky left-0 bg-white dark:bg-gray-950">Month</th>
              <th className="py-3 px-4 text-right font-medium border-x">House Value</th>
              <th className="py-3 px-4 text-right font-medium border-x">Equity</th>
              <th className="py-3 px-4 text-right font-medium border-x">Mortgage Payment</th>
              <th className="py-3 px-4 text-right font-medium border-x">Total Monthly</th>
              <th className="py-3 px-4 text-right font-medium border-x">Cumulative Total</th>
              <th className="py-3 px-4 text-right font-medium border-x">Cumulative Tax Savings</th>
              <th className="py-3 px-4 text-right font-medium border-x">Net Value</th>
              <th className="py-3 px-4 text-right font-medium border-x">Net Value After Tax</th>
              <th className="py-3 px-4 text-right font-medium border-x">Rental Payments</th>
              <th className="py-3 px-4 text-right font-medium border-x">Investment Principal</th>
              <th className="py-3 px-4 text-right font-medium border-x">Investment Interest</th>
              <th className="py-3 px-4 text-right font-medium border-x">Investment Total</th>
              <th className="py-3 px-4 text-right font-medium border-x">Net Value</th>
              <th className="py-3 px-4 text-right font-medium border-x">Buy vs Rent</th>
            </tr>
          </thead>
          <tbody>
            {buyData.map((month, index) => (
              <tr key={`buy-${index}`} className="border-t">
                <td className="py-2 px-4 sticky left-0 bg-white dark:bg-gray-950">{index + 1}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.houseValue)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.equity)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.payment)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.totalMonthly)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.cumulativePayments)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.taxSavings)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.netValue)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.netValueAfterTax)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(rentData[index].totalMonthly)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(rentData[index].principal)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(rentData[index].interestToDate)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(rentData[index].investmentValue)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(rentData[index].netValue)}</td>
                <td className="py-2 px-4 text-right border-x">{formatCurrency(month.netValueAfterTax - rentData[index].netValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 