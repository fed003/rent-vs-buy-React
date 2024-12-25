import { useState } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import BuyVisualizations from './BuyVisualizations';
import RentVisualizations from './RentVisualizations';
import ComparisonChart from './ComparisonChart';
import { MonthlyData, RentMonthlyData, generateMonthlyData, generateRentMonthlyData, CalculationInputs } from '@/utils/calculations';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'buy' | 'rent'>('compare');
  const [isOpen, setIsOpen] = useState(false);
  const [buyResults, setBuyResults] = useState<MonthlyData[] | null>(null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(null);

  const handleCalculations = (inputs: CalculationInputs) => {
    const results = generateMonthlyData(inputs.buyInputs);
    setBuyResults(results);
    
    const rentResults = generateRentMonthlyData(inputs.rentInputs, inputs.monthsToCalculate);
    setRentResults(rentResults);
  };

  return (
    <div className="relative min-h-screen">
      {/* Toggle Button - Always visible */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Input Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="left" 
          className="w-[500px] overflow-y-auto border-r bg-card"
        >
          <div className="h-full py-6">
            <CalculatorForm 
              onCalculate={handleCalculations}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area - Charts */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {(buyResults || rentResults) && (
            <Tabs 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'compare' | 'buy' | 'rent')}
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="grid w-[600px] grid-cols-3">
                  <TabsTrigger value="compare">Compare Options</TabsTrigger>
                  <TabsTrigger value="buy">Purchase Analysis</TabsTrigger>
                  <TabsTrigger value="rent">Rental Analysis</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="compare">
                <ComparisonChart buyData={buyResults} rentData={rentResults} />
              </TabsContent>
              
              <TabsContent value="buy">
                {buyResults && <BuyVisualizations monthlyData={buyResults} />}
              </TabsContent>
              
              <TabsContent value="rent">
                {rentResults && <RentVisualizations monthlyData={rentResults} />}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calculator;