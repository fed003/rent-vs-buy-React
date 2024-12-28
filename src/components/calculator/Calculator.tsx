import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import BuyVisualizations from './BuyVisualizations';
import RentVisualizations from './RentVisualizations';
import ComparisonChart from './ComparisonChart';
import Assumptions from './Assumptions';
import DataTable from './DataTable';
import { 
  BuyInputs, 
  RentInputs, 
  BuyMonthlyData, 
  RentMonthlyData, 
  generateMonthlyData, 
  CalculationInputs,
} from '@/utils/calculations';

const STORAGE_KEYS = {
  BUY_INPUTS: 'buyCalculatorInputs',
  RENT_INPUTS: 'rentCalculatorInputs'
};

type TabValue = 'assumptions' | 'compare' | 'buy' | 'rent' | 'data';

const Calculator = () => {
  const savedBuyInputs = localStorage.getItem(STORAGE_KEYS.BUY_INPUTS);
  const savedRentInputs = localStorage.getItem(STORAGE_KEYS.RENT_INPUTS); 
  
  const [buyInputs, setBuyInputs] = useState<BuyInputs | null>(savedBuyInputs ? JSON.parse(savedBuyInputs) : null);
  const [rentInputs, setRentInputs] = useState<RentInputs | null>(savedRentInputs ? JSON.parse(savedRentInputs) : null);
    
  const results = buyInputs && rentInputs ? generateMonthlyData({
    buyInputs, rentInputs
  }) : undefined;

  const [buyResults, setBuyResults] = useState<BuyMonthlyData[] | null>(results?.buyData ?? null);
  const [rentResults, setRentResults] = useState<RentMonthlyData[] | null>(results?.rentData ?? null);
  
  const [isOpen, setIsOpen] = useState(!buyInputs || !rentInputs);
  const [disableTabs, setDisableTabs] = useState<boolean>(isOpen);
  const [activeTab, setActiveTab] = useState<TabValue>(getInitialTab());
  
  function getInitialTab(): TabValue {
    const hash = window.location.hash.replace('#', '');
    return (hash as TabValue) || (isOpen ? 'assumptions' : 'compare');
  }

  useEffect(() => {
    // Update URL when tab changes
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    // Listen for URL changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash as TabValue);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCalculations = (inputs: CalculationInputs, saveValues: boolean = true) => {
    setBuyInputs(inputs.buyInputs);
    setRentInputs(inputs.rentInputs);

    const results = generateMonthlyData({ 
      buyInputs: inputs.buyInputs, 
      rentInputs: inputs.rentInputs 
    }); 

    setBuyResults(results.buyData);
    setRentResults(results.rentData);
        
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
    <div className="relative">
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
              onValueChange={(value) => setActiveTab(value as TabValue)}
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="grid w-[600px] grid-cols-2 md:grid-cols-5">
                  <TabsTrigger value="assumptions" >Assumptions</TabsTrigger>
                    <TabsTrigger value="compare" disabled={disableTabs}>Comparison</TabsTrigger>
                    <TabsTrigger value="buy" disabled={disableTabs}>Purchase Analysis</TabsTrigger>
                    <TabsTrigger value="rent" disabled={disableTabs}>Rental Analysis</TabsTrigger>
                    <TabsTrigger value="data" disabled={disableTabs}>Data Table</TabsTrigger>
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

              <TabsContent value="data">
                {buyResults && rentResults && <DataTable buyData={buyResults} rentData={rentResults} />}
              </TabsContent>
            </Tabs>
          
        </div>
      </main>
    </div>
  );
};

export default Calculator;