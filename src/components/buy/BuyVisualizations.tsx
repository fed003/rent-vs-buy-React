import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  TooltipProps
} from 'recharts';
import { MonthlyData } from '@/utils/calculations';

interface BuyVisualizationsProps {
  monthlyData: MonthlyData[];
}

interface YearlyData extends MonthlyData {
  year: number;
}


const BuyVisualizations = ({ monthlyData }: BuyVisualizationsProps) => {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const dfltMargins = { top: 5, right: 5, left: 15, bottom: 20 };

  const yearlyData: YearlyData[] = monthlyData
    .filter((_, index) => index % 12 === 0)
    .map((month, index) => ({
      ...month,
      year: index + 1
    }));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-medium">
            {timeUnit === 'years' ? `Year ${label}` : `Month ${label}`}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
                    <Tooltip content={<CustomTooltip />} />
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

        {/* Monthly Payment Breakdown */}
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
                    <Tooltip content={<CustomTooltip />} />
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
        </Card>

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
                  <span className="text-sm">Insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-sm">Property Tax</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffc658]" />
                  <span className="text-sm">HOA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff8042]" />
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
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="insurance"
                      name="Insurance"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="propertyTax"
                      name="Property Tax"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="hoa"
                      name="HOA"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                    <Area
                      type="monotone"
                      dataKey="maintenance"
                      name="Maintenance"
                      stackId="1"
                      stroke="#ff8042"
                      fill="#ff8042"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Monthly Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Total Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-sm">Total Cost</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
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
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="totalMonthly"
                      name="Total Cost"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
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