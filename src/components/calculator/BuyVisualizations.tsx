import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomTooltip from '@/components/ui/CustomTooltip';
import {
  ComposedChart,
  Line,
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BuyMonthlyData } from '@/utils/calculations';
import { formatCurrency, dfltMargins } from '@/utils/visualizations';
import ChartContainer, { LegendItem } from './ChartContainer';

interface BuyVisualizationsProps {
  monthlyData: BuyMonthlyData[];
}

interface YearlyData extends BuyMonthlyData {
  year: number;
}

const BuyVisualizations = ({ monthlyData }: BuyVisualizationsProps) => {
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
        {/* Equity & Home Value Chart */}
        <ChartContainer 
          title="Equity & Home Value"
          legend={
            <>
              <LegendItem color="#8884d8" label="Home Value" />
              <LegendItem color="#82ca9d" label="Equity" />
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
                dataKey="houseValue"
                name="Home Value"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="equity"
                name="Equity"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Monthly Expenses */}
        <ChartContainer 
          title="Monthly Expenses"
          legend={
            <>
              <LegendItem color="#8884d8" label="Mortgage Principal" />
              <LegendItem color="#82ca9d" label="Mortgage Interest" />              
              <LegendItem color="#ffc658" label="Property Tax" />
              <LegendItem color="#ff8042" label="HOA" />
              <LegendItem color="#8dd1e1" label="Maintenance" />
              <LegendItem color="#d884d8" label="Insurance" />
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
                dataKey="principalPaid"
                name="Principal"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="interestPaid"
                name="Interest"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="propertyTax"
                name="Property Tax"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
              <Area
                type="monotone"
                dataKey="hoa"
                name="HOA"
                stackId="1"
                stroke="#ff8042"
                fill="#ff8042"
              />
              <Area
                type="monotone"
                dataKey="maintenance"
                name="Maintenance"
                stackId="1"
                stroke="#8dd1e1"
                fill="#8dd1e1"
              />
              <Area
                type="monotone"
                dataKey="insurance"
                name="Insurance"
                stackId="1"
                stroke="#d884d8"
                fill="#d884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Cumulative Payments */}
        <ChartContainer 
          title="Cumulative Payments"
          legend={
            <>
              <LegendItem color="#2563eb" label="Total Payments" />
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
                name="Total Payments"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Net Value Over Time */}
        <ChartContainer 
          title="Net Value Over Time"
          legend={
            <>
              <LegendItem color="#ff8042" label="Home Value" />
              <LegendItem color="#0088FE" label="Cumulative Expenses" />
              <LegendItem color="#82ca9d" label="Net Value" />
              <LegendItem color="#8884d8" label="Net Value After Tax" />
            </>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
              {/* House Value (positive area) */}
              <Area
                type="monotone"
                dataKey="houseValue"
                name="Home Value"
                fill="#ff8042"
                stroke="#ff8042"
                fillOpacity={0.6}
              />
              {/* Cumulative Expenses (negative area) */}
              <Area
                type="monotone"
                dataKey="cumulativePayments"
                name="Cumulative Expenses"
                fill="#0088FE"
                stroke="#0088FE"
                fillOpacity={0.6}
              />
              {/* Net Value Line */}
              <Line
                type="monotone"
                dataKey="netValue"
                name="Net Value"
                stroke="#82ca9d"
                strokeWidth={2}
              />
              {/* Net Value After Tax Line */}
              <Line
                type="monotone"
                dataKey="netValueAfterTax"
                name="Net Value After Tax"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default BuyVisualizations;