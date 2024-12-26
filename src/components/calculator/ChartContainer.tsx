import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  legend?: ReactNode;
  headerContent?: ReactNode;
}

const ChartContainer = ({ title, children, legend, headerContent }: ChartContainerProps) => {
  return (
    <Card className="p-2 sm:p-6">
      <CardHeader className="p-2 sm:p-6">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          {headerContent}
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="space-y-2 sm:space-y-4">
          {legend && (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
              {legend}
            </div>
          )}
          <div className="h-[250px] landscape:sm:h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for consistent legend items
export const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1 sm:gap-2">
    <div 
      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
      style={{ backgroundColor: color }} 
    />
    <span>{label}</span>
  </div>
);

export default ChartContainer; 