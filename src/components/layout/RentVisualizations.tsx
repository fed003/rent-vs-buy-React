import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomTooltip from '@/components/ui/CustomTooltip';
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { RentMonthlyData } from '@/utils/calculations';
import { formatCurrency, dfltMargins } from '@/utils/visualizations';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Investment Growth */}
         <Card>
          <CardHeader>
            <CardTitle>Investment Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Investment Value</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={displayData}
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
                    <Area
                      type="monotone"
                      dataKey="investmentValue"
                      name="Investment Value"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div></div>

        {/* Monthly Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-sm">Rent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Insurance</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={displayData}
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
                      dataKey="insurance"
                      name="Insurance"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Value Chart - Updated with Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Net Value Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
                  <span className="text-sm">Investment Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0088FE]" />
                  <span className="text-sm">Cumulative Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Net Value</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={displayData}
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
                    {/* Investment Value (positive area) */}
                    <Area
                      type="monotone"
                      dataKey="investmentValue"
                      name="Investment Value"
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
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentVisualizations;