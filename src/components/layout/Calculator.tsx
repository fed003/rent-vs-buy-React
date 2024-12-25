import { useState } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import BuyVisualizations from './BuyVisualizations';
import RentVisualizations from './RentVisualizations';
import { BuyInputs, RentInputs, MonthlyData, RentMonthlyData, generateMonthlyData, generateRentMonthlyData } from '@/utils/calculations';

type CalculationType = 'buy' | 'rent';

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeCalculator, setActiveCalculator] = useState<CalculationType>('buy');
  const [buyResults, setBuyResults] = useState<MonthlyData[] | null>(null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(null);

  const handleBuyCalculation = (inputs: BuyInputs) => {
    const results = generateMonthlyData(inputs);
    setBuyResults(results);
    setActiveCalculator('buy');
  };

  const handleRentCalculation = (inputs: RentInputs, monthsToCalculate: number) => {
    const results = generateRentMonthlyData(inputs, monthsToCalculate);
    setRentResults(results);
    setActiveCalculator('rent');
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
              onBuyCalculate={handleBuyCalculation}
              onRentCalculate={handleRentCalculation}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area - Charts */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {(buyResults || rentResults) && (
            <Tabs 
              value={activeCalculator}
              onValueChange={(value) => setActiveCalculator(value as CalculationType)}
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="buy">Purchase Analysis</TabsTrigger>
                  <TabsTrigger value="rent">Rental Analysis</TabsTrigger>
                </TabsList>
              </div>

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