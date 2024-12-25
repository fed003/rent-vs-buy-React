import { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import BuyVisualizations from './BuyVisualizations';
import RentVisualizations from './RentVisualizations';
import ComparisonChart from './ComparisonChart';
import { BuyInputs, RentInputs, BuyMonthlyData, RentMonthlyData, generateBuyMonthlyData, generateRentMonthlyData, CalculationInputs } from '@/utils/calculations';

const STORAGE_KEYS = {
  BUY_INPUTS: 'buyCalculatorInputs',
  RENT_INPUTS: 'rentCalculatorInputs'
};

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'buy' | 'rent'>('compare');
  const [isOpen, setIsOpen] = useState(false);
  const [buyResults, setBuyResults] = useState<BuyMonthlyData[] | null>(null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(null);
  const [buyInputs, setBuyInputs] = useState<BuyInputs | null>(null);
  const [rentInputs, setRentInputs] = useState<RentInputs | null>(null);

  // Load saved inputs on mount
  useEffect(() => {
    const savedBuyInputs = localStorage.getItem(STORAGE_KEYS.BUY_INPUTS);
    const savedRentInputs = localStorage.getItem(STORAGE_KEYS.RENT_INPUTS);
   
    if (savedBuyInputs) {
      const parsedBuyInputs = JSON.parse(savedBuyInputs) as BuyInputs;
      setBuyInputs(parsedBuyInputs);
    }

    if (savedRentInputs) {
      const parsedRentInputs = JSON.parse(savedRentInputs) as RentInputs;
      setRentInputs(parsedRentInputs);
    }

    if (buyInputs && rentInputs) {
      handleCalculations({
        buyInputs,
        rentInputs,
      }, false);
    }
  }, []);


  const getMonthsToCalculate = (inputs: CalculationInputs) => {
    const buyMonths = Number.parseInt(inputs.buyInputs.mortgageYears) * 12;
    return buyMonths;
  }

  const handleCalculations = (inputs: CalculationInputs, saveValues: boolean = true) => {
    const results = generateBuyMonthlyData(inputs.buyInputs);
    setBuyResults(results);
    
    const rentResults = generateRentMonthlyData(inputs.rentInputs, getMonthsToCalculate(inputs), results);
    setRentResults(rentResults);

    if (saveValues) {
      localStorage.setItem(STORAGE_KEYS.BUY_INPUTS, JSON.stringify(inputs.buyInputs));
      localStorage.setItem(STORAGE_KEYS.RENT_INPUTS, JSON.stringify(inputs.rentInputs));
    }
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
              buyInputValues={buyInputs}
              rentInputValues={rentInputs}
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