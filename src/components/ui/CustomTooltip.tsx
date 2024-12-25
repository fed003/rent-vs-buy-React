import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  timeUnit: 'years' | 'months';
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  timeUnit 
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-medium">
          {timeUnit === 'years' ? `Year ${label}` : `Month ${label}`}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(entry.value as number)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;