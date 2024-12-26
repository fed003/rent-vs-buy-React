import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
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
  const [activeTab, setActiveTab] = useState<'assumptions' | 'compare' | 'buy' | 'rent'>('assumptions');
  const [isOpen, setIsOpen] = useState(false);
  
  const [buyInputs, setBuyInputs] = useState<BuyInputs | null>(null);
  const [rentInputs, setRentInputs] = useState<RentInputs | null>(null);
  
  const [buyResults, setBuyResults] = useState<BuyMonthlyData[] | null>(null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(null);
  const [disableTabs, setDisableTabs] = useState<boolean>(true);

  const getMonthsToCalculate = (inputs: CalculationInputs) => {
    const buyMonths = Number.parseInt(inputs.buyInputs.mortgageYears) * 12;
    return buyMonths;
  }

  const handleCalculations = (inputs: CalculationInputs, saveValues: boolean = true) => {
    console.log('Calculating...');
    console.log('Inputs:', inputs, saveValues);

    setBuyInputs(inputs.buyInputs);
    setRentInputs(inputs.rentInputs);

    const generatedBuyResults = generateBuyMonthlyData(inputs.buyInputs);
    setBuyResults(generatedBuyResults);
    console.log('Buy Results:', generatedBuyResults, buyResults);

    const generatedRentResults = generateRentMonthlyData(inputs.rentInputs, getMonthsToCalculate(inputs), generatedBuyResults);
    setRentResults(generatedRentResults);
    console.log('Rent Results:', generatedRentResults, rentResults);
    
    if (buyResults && rentResults) {
      console.log('Enabling Tabs');
      setDisableTabs(false);
      setActiveTab('compare');
      setIsOpen(false);
    }

    if (saveValues) {
      console.log('Saving Inputs...');
      localStorage.setItem(STORAGE_KEYS.BUY_INPUTS, JSON.stringify(inputs.buyInputs));
      localStorage.setItem(STORAGE_KEYS.RENT_INPUTS, JSON.stringify(inputs.rentInputs));
    }
  };

  // Load saved inputs on mount
  useEffect(() => {
    console.log('on mount');
    const savedBuyInputs = localStorage.getItem(STORAGE_KEYS.BUY_INPUTS);
    const savedRentInputs = localStorage.getItem(STORAGE_KEYS.RENT_INPUTS);
  
    if (savedBuyInputs && savedRentInputs) {
      console.log('Loading saved inputs...');
      handleCalculations({
        buyInputs: JSON.parse(savedBuyInputs) as BuyInputs,
        rentInputs: JSON.parse(savedRentInputs) as RentInputs,
      }, false);
    }
  }, []);

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
           <SheetHeader>
            <SheetTitle>Calculator Inputs</SheetTitle>
            <SheetDescription>Enter your details to calculate the cost of buying vs renting a home.</SheetDescription>
           </SheetHeader>
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
          
            <Tabs 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'assumptions' |'compare' | 'buy' | 'rent')}
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="grid w-[600px] grid-cols-4">
                  <TabsTrigger value="assumptions" >Assumptions</TabsTrigger>
                    <TabsTrigger value="compare" disabled={disableTabs}>Comparison</TabsTrigger>
                    <TabsTrigger value="buy" disabled={disableTabs}>Purchase Analysis</TabsTrigger>
                    <TabsTrigger value="rent" disabled={disableTabs}>Rental Analysis</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="assumptions">
                Assumptions
              </TabsContent>

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
          
        </div>
      </main>
    </div>
  );
};

export default Calculator;