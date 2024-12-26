import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import BuyVisualizations from './BuyVisualizations';
import RentVisualizations from './RentVisualizations';
import ComparisonChart from './ComparisonChart';
import Assumptions from './Assumptions';
import { BuyInputs, RentInputs, BuyMonthlyData, RentMonthlyData, generateBuyMonthlyData, generateRentMonthlyData, CalculationInputs } from '@/utils/calculations';

const STORAGE_KEYS = {
  BUY_INPUTS: 'buyCalculatorInputs',
  RENT_INPUTS: 'rentCalculatorInputs'
};

const Calculator = () => {
  const savedBuyInputs = localStorage.getItem(STORAGE_KEYS.BUY_INPUTS);
  const savedRentInputs = localStorage.getItem(STORAGE_KEYS.RENT_INPUTS); 
  
  const [buyInputs, setBuyInputs] = useState<BuyInputs | null>(savedBuyInputs ? JSON.parse(savedBuyInputs) : null);
  const [rentInputs, setRentInputs] = useState<RentInputs | null>(savedRentInputs ? JSON.parse(savedRentInputs) : null);
  
  const getMonthsToCalculate = (inputs: CalculationInputs) => {
    const buyMonths = Number.parseInt(inputs.buyInputs.mortgageYears) * 12;
    return buyMonths;
  }
  
  const [buyResults, setBuyResults] = useState<BuyMonthlyData[] | null>(buyInputs ? generateBuyMonthlyData(buyInputs) : null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(rentInputs && buyInputs ? 
    generateRentMonthlyData(rentInputs, getMonthsToCalculate({ buyInputs: buyInputs, rentInputs: rentInputs }), buyResults) : null);
  
  const [isOpen, setIsOpen] = useState(!buyInputs || !rentInputs);
  const [disableTabs, setDisableTabs] = useState<boolean>(isOpen);
  const [activeTab, setActiveTab] = useState<'assumptions' | 'compare' | 'buy' | 'rent'>(isOpen ? 'assumptions' : 'compare');
  
  const handleCalculations = (inputs: CalculationInputs, saveValues: boolean = true) => {
    setBuyInputs(inputs.buyInputs);
    setRentInputs(inputs.rentInputs);

    const generatedBuyResults = generateBuyMonthlyData(inputs.buyInputs);
    setBuyResults(generatedBuyResults);

    const generatedRentResults = generateRentMonthlyData(inputs.rentInputs, getMonthsToCalculate(inputs), generatedBuyResults);
    setRentResults(generatedRentResults);
        
    if (buyResults && rentResults) {
      setDisableTabs(false);
      setActiveTab('compare');
      setIsOpen(false);
    }

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
          className="overflow-y-auto border-r bg-card"
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
                <Assumptions />
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