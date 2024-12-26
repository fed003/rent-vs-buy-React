import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RentMonthlyData } from '@/utils/calculations';
import { formatCurrency, dfltMargins } from '@/utils/visualizations';
import CustomTooltip from '@/components/ui/CustomTooltip';
import ChartContainer, { LegendItem } from './ChartContainer';

interface RentVisualizationsProps {
  monthlyData: RentMonthlyData[];
}

interface YearlyData extends RentMonthlyData {
  year: number;
}

const RentVisualizations = ({ monthlyData }: RentVisualizationsProps) => {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const yearlyData: YearlyData[] = monthlyData
    .filter((_, index) => index % 12 === 0)
    .map((month, index) => ({
      ...month,
      year: index + 1
    }));

  const displayData = timeUnit === 'years' ? yearlyData : monthlyData;

  const headerContent = (
    <Tabs defaultValue="years" className="w-48" onValueChange={(value) => setTimeUnit(value as 'years' | 'months')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="years">Years</TabsTrigger>
        <TabsTrigger value="months">Months</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {headerContent}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Expenses */}
        <ChartContainer 
          title="Monthly Expenses"
          legend={
            <>
              <LegendItem color="#8884d8" label="Rent" />
              <LegendItem color="#82ca9d" label="Utilities" />
              <LegendItem color="#ffc658" label="Renter's Insurance" />
            </>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
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
              <Area
                type="monotone"
                dataKey="rent"
                name="Rent"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="utilities"
                name="Utilities"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="insurance"
                name="Renter's Insurance"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Cumulative Expenses */}
        <ChartContainer 
          title="Cumulative Expenses"
          legend={
            <>
              <LegendItem color="#2563eb" label="Total Expenses" />
            </>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
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
                dataKey="cumulativePayments"
                name="Total Expenses"
                stroke="#2563eb"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Net Value Chart */}
        <ChartContainer 
          title="Net Value Over Time"
          legend={
            <>
              <LegendItem color="#82ca9d" label="Net Value" />
            </>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
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
                dataKey="netValue"
                name="Net Value"
                stroke="#82ca9d"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RentVisualizations;