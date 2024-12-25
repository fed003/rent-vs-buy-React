import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyData, RentMonthlyData } from '@/utils/calculations';
import { formatCurrency, dfltMargins } from '@/utils/visualizations';
import CustomTooltip from '@/components/ui/CustomTooltip';

interface ComparisonChartProps {
  buyData: MonthlyData[] | null;
  rentData: RentMonthlyData[] | null;
}

const ComparisonChart = ({ buyData, rentData }: ComparisonChartProps) => {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Tabs defaultValue="years" className="w-48" onValueChange={(value) => setTimeUnit(value as 'years' | 'months')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="years">Years</TabsTrigger>
            <TabsTrigger value="months">Months</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
    <Card>
      <CardHeader>
        <CardTitle>Net Value Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
              <span className="text-sm">Buy Net Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
              <span className="text-sm">Buy Net Value (After Tax)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
              <span className="text-sm">Rent Net Value</span>
            </div>
          </div>
          <div className="h-[600px]"> {/* Taller chart for better visibility */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeUnit === 'years' ? yearlyData : displayData}
                margin={dfltMargins}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={timeUnit === 'years' ? 'year' : 'month'}
                  label={{ value: timeUnit === 'years' ? 'Years' : 'Months', position: 'bottom', offset: 5 }}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  width={80}
                />
                <Tooltip content={(props) => <CustomTooltip {...props} timeUnit={timeUnit} />} />
                <Line
                  type="monotone"
                  dataKey="buyNetValue"
                  name="Buy Net Value"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="buyNetValueAfterTax"
                  name="Buy Net Value (After Tax)"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rentNetValue"
                  name="Rent Net Value"
                  stroke="#ff8042"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  );
};

export default ComparisonChart;