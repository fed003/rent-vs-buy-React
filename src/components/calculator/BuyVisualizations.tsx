import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        {/* Equity & Home Value Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Equity & Home Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8] opacity-50" />
                  <span className="text-sm">Home Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d] opacity-50" />
                  <span className="text-sm">Equity</span>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Payment Breakdown
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-sm">Principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffc658]" />
                  <span className="text-sm">PMI</span>
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
                      dataKey="pmi"
                      name="PMI"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Monthly Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-sm">Mortgage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffc658]" />
                  <span className="text-sm">Property Tax</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
                  <span className="text-sm">HOA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8dd1e1]" />
                  <span className="text-sm">Maintenance</span>
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
                      dataKey="payment"
                      name="Mortgage"
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
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cumulative payments */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
                  <span className="text-sm">Home Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0088FE]" />
                  <span className="text-sm">Cumulative Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Net Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-sm">Net Value After Tax</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData} margin={dfltMargins}>
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
                      dataKey="cumulativePayments"
                      name="Total Payments"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

       {/* Net Value Chart - Updated with Areas and Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Net Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
                <span className="text-sm">Home Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0088FE]" />
                <span className="text-sm">Cumulative Expenses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                <span className="text-sm">Net Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                <span className="text-sm">Net Value After Tax</span>
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
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default BuyVisualizations;