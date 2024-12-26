// import { useState } from 'react';
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BuyMonthlyData, RentMonthlyData } from '@/utils/calculations';
import { formatCurrency, dfltMargins } from '@/utils/visualizations';
import CustomTooltip from '@/components/ui/CustomTooltip';
import ChartContainer, { LegendItem } from './ChartContainer';

interface ComparisonChartProps {
  buyData: BuyMonthlyData[] | null;
  rentData: RentMonthlyData[] | null;
}

const ComparisonChart = ({ buyData, rentData }: ComparisonChartProps) => {
  // const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const timeUnit = 'years';

  // Prepare data for comparison
  const prepareComparisonData = () => {
    if (!buyData || !rentData) return [];

    return buyData.map((buyMonth, index) => {
      const rentMonth = rentData[index];
      return {
        month: index + 1,
        year: Math.floor(index / 12) + 1,
        buyNetValue: buyMonth.netValue,
        buyNetValueAfterTax: buyMonth.netValueAfterTax,
        rentNetValue: rentMonth.netValue
      };
    });
  };

  const displayData = prepareComparisonData();
  const yearlyData = displayData.filter((_, index) => index % 12 === 0);

  const legend = (
    <>
      <LegendItem color="#82ca9d" label="Buy Net Value" />
      <LegendItem color="#8884d8" label="Buy Net Value (After Tax)" />
      <LegendItem color="#ff8042" label="Rent Net Value" />
    </>
  );

  const headerContent = "";
  /* 
  const headerContent = (
    <Tabs defaultValue="years" className="w-48" onValueChange={(value) => setTimeUnit(value as 'years' | 'months')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="years">Years</TabsTrigger>
        <TabsTrigger value="months">Months</TabsTrigger>
      </TabsList>
    </Tabs>
  );
  */

  return (
    <ChartContainer 
      title="Net Value Comparison"
      legend={legend}
      headerContent={headerContent}
    >    
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={timeUnit === 'years' ? yearlyData : displayData}
          margin={dfltMargins}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={timeUnit === 'years' ? 'year' : 'month'}
            label={{ 
              value: timeUnit === 'years' ? 'Years' : 'Months', 
              position: 'bottom', 
              offset: 0,
              fontSize: 12 
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            width={65}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} timeUnit={timeUnit} />} />
          <Line
            type="monotone"
            dataKey="buyNetValue"
            name="Buy Net Value"
            stroke="#82ca9d"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="buyNetValueAfterTax"
            name="Buy Net Value (After Tax)"
            stroke="#8884d8"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rentNetValue"
            name="Rent Net Value"
            stroke="#ff8042"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ComparisonChart;