import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BuyMonthlyData, RentMonthlyData, filterData } from '@/utils/calculations';
import { formatCurrency } from '@/utils/visualizations';

interface DataTableProps {
  buyData: BuyMonthlyData[];
  rentData: RentMonthlyData[];
}

const DataTable = ({ buyData, rentData }: DataTableProps) => {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
    
  function filterDataTableData(data: any[], timeUnit: 'years' | 'months') {
    if (timeUnit === 'years') {
      // return data.filter((_, index) => (index + 1) % 12 === 0);
      return filterData(data);
    }
    return data;
  }

  const buyDisplayData = filterDataTableData(buyData, timeUnit);
  const rentDisplayData = filterDataTableData(rentData, timeUnit);

  const headerContent = (
    <Tabs defaultValue="years" className="w-48" onValueChange={(value) => setTimeUnit(value as 'years' | 'months')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="years">Years</TabsTrigger>
        <TabsTrigger value="months">Months</TabsTrigger>
      </TabsList>
    </Tabs>
  );
  
  const exportToCsv = () => {
    const headers = [
      timeUnit === 'years' ? 'Year' : 'Month',
      'House Value',
      'Equity',
      'Mortgage Payment',
      'Total Monthly',
      'Cumulative Total',
      'Cumulative Tax Savings',
      'Buy Investment Total',
      'Net Value',
      'Net Value After Tax',
      'Rental Payments',
      'Rental Totals',
      'Investment Principal',
      'Investment Interest',
      'Investment Total',
      'Rent Net Value',
      'Buy vs Rent'
    ];

    const rows = buyDisplayData.map((buyRecord, index) => [
      // timeUnit === 'years' ? `Year ${index + 1}` : `Month ${index + 1}`,
      index + 1,
      buyRecord.houseValue,
      buyRecord.equity,
      buyRecord.payment,
      buyRecord.totalMonthly,
      buyRecord.cumulativePayments,
      buyRecord.cumulativeTaxSavings,
      buyRecord.investmentValue,
      buyRecord.netValue,
      buyRecord.netValueAfterTax,
      rentDisplayData[index].totalMonthly,
      rentDisplayData[index].cumulativePayments,
      rentDisplayData[index].principal,
      rentDisplayData[index].interestToDate,
      rentDisplayData[index].investmentValue,
      rentDisplayData[index].netValue,
      buyRecord.netValueAfterTax - rentDisplayData[index].netValue
    ]);

    const csvContent = [
      headers.join(','),
        ...rows
      // ...rows.map(row => row.map(cell => 
      //   typeof cell === 'number' ? formatCurrency(cell).replace('$', '') : cell
      // ).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `buy-vs-rent-${timeUnit}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={exportToCsv}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        {headerContent}
      </div>

      <div className="relative rounded-md border">
        <div className="overflow-x-auto overflow-y-auto min-h-[450px] h-[calc(100vh-250px)]">
          <table className="w-full border-collapse table-striped table-hover">
            <thead className="sticky top-0 bg-gray-200 dark:bg-gray-950 z-20">
              <tr>
                <th className="py-3 px-4 text-left font-medium sticky left-0 bg-gray-200 dark:bg-gray-950">{timeUnit === 'years' ? 'Year' : 'Month'}</th>
                <th className="py-3 px-4 text-right font-medium">House Value</th>
                <th className="py-3 px-4 text-right font-medium">Equity</th>
                <th className="py-3 px-4 text-right font-medium">Mortgage Payment</th>
                <th className="py-3 px-4 text-right font-medium">Total Monthly</th>
                <th className="py-3 px-4 text-right font-medium">Cumulative Total</th>
                <th className="py-3 px-4 text-right font-medium">Cumulative Tax Savings</th>
                <th className="py-3 px-4 text-right font-medium">Investment Total</th>
                <th className="py-3 px-4 text-right font-medium">Net Value</th>
                <th className="py-3 px-4 text-right font-medium">Net Value After Tax</th>
                <th className="py-3 px-4 text-right font-medium">Rental Payments</th>
                <th className="py-3 px-4 text-right font-medium">Rental Totals</th>
                <th className="py-3 px-4 text-right font-medium">Investment Principal</th>
                <th className="py-3 px-4 text-right font-medium">Investment Interest</th>
                <th className="py-3 px-4 text-right font-medium">Investment Total</th>
                <th className="py-3 px-4 text-right font-medium">Net Value</th>
                <th className="py-3 px-4 text-right font-medium">Buy vs Rent</th>
              </tr>
            </thead>
            <tbody>
              {buyDisplayData.map((buyRecord, index) => (
                <tr 
                  key={`buy-${index}`} 
                >
                  <td className="py-2 px-4 sticky left-0 bg-gray-200 dark:bg-gray-950">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.houseValue)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.equity)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.payment)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.totalMonthly)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.cumulativePayments)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.cumulativeTaxSavings)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.investmentValue)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.netValue)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.netValueAfterTax)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].totalMonthly)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].cumulativePayments)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].principal)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].interestToDate)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].investmentValue)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(rentDisplayData[index].netValue)}</td>
                  <td className="py-2 px-4 text-right border-x">{formatCurrency(buyRecord.netValueAfterTax - rentData[index].netValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable; 