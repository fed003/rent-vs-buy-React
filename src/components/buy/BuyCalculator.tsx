import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import BuyVisualizations from './BuyVisualizations';
import { BuyInputs, MonthlyData, generateMonthlyData } from '@/utils/calculations';

type ErrorState = {
  [K in keyof BuyInputs]?: string;
};

const InputWrapper = ({ children, label, error }: { 
  children: React.ReactNode; 
  label: string; 
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-foreground">{label}</label>
    <div className="relative">
      {children}
    </div>
    {error && (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </div>
);

const BuyCalculator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputs, setInputs] = useState<BuyInputs>({
    housePrice: '',
    downPaymentPercent: '',
    downPaymentAmount: '',
    mortgageRate: '',
    mortgageYears: '',
    zipcode: '',
    appreciationRate: '',
    annualInsurance: '',
    insuranceIncreaseRate: '',
    propertyTax: '',
    propertyTaxIncreaseRate: '',
    monthlyHOA: '',
    hoaIncreaseRate: '',
    closingCostPercent: '',
    maintenancePercent: '',
    maintenanceAmount: ''
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [calculationResults, setCalculationResults] = useState<MonthlyData[] | null>(null);

  useEffect(() => {
    if (inputs.housePrice && inputs.downPaymentPercent) {
      const amount = (parseFloat(inputs.housePrice) * parseFloat(inputs.downPaymentPercent)) / 100;
      setInputs(prev => ({
        ...prev,
        downPaymentAmount: amount.toFixed(2)
      }));
    } else if (inputs.housePrice && inputs.downPaymentAmount) {
      const percent = (parseFloat(inputs.downPaymentAmount) / parseFloat(inputs.housePrice)) * 100;
      setInputs(prev => ({
        ...prev,
        downPaymentPercent: percent.toFixed(2)
      }));
    }

    if (inputs.housePrice && inputs.maintenancePercent) {
      const amount = (parseFloat(inputs.housePrice) * parseFloat(inputs.maintenancePercent)) / 100;
      setInputs(prev => ({
        ...prev,
        maintenanceAmount: amount.toFixed(2)
      }));
    } else if (inputs.housePrice && inputs.maintenanceAmount) {
      const percent = (parseFloat(inputs.maintenanceAmount) / parseFloat(inputs.housePrice)) * 100;
      setInputs(prev => ({
        ...prev,
        maintenancePercent: percent.toFixed(2)
      }));
    }
  }, [
    inputs.housePrice,
    inputs.downPaymentPercent,
    inputs.downPaymentAmount,
    inputs.maintenancePercent,
    inputs.maintenanceAmount
  ]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof BuyInputs]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: ErrorState = {};
    
    // Required fields
    if (!inputs.housePrice) newErrors.housePrice = 'House price is required';
    if (!inputs.downPaymentPercent && !inputs.downPaymentAmount) {
      newErrors.downPaymentPercent = 'Either down payment percentage or amount is required';
    }
    if (!inputs.mortgageRate) newErrors.mortgageRate = 'Mortgage rate is required';
    if (!inputs.mortgageYears) newErrors.mortgageYears = 'Mortgage length is required';
    if (!inputs.zipcode) newErrors.zipcode = 'Zipcode is required';
    
    // Validate mortgage rate is reasonable
    if (inputs.mortgageRate && (parseFloat(inputs.mortgageRate) <= 0 || parseFloat(inputs.mortgageRate) > 20)) {
      newErrors.mortgageRate = 'Please enter a valid interest rate between 0 and 20%';
    }

    // Validate mortgage length is reasonable
    if (inputs.mortgageYears && (parseFloat(inputs.mortgageYears) < 1 || parseFloat(inputs.mortgageYears) > 50)) {
      newErrors.mortgageYears = 'Please enter a valid term between 1 and 50 years';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      const results = generateMonthlyData(inputs);
      setCalculationResults(results);
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
          <div className="h-full py-6 pl-6 pr-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Purchase Calculator</h2>

                {/* House Price */}
                <InputWrapper label="House Price" error={errors.housePrice}>
                  <Input
                    type="number"
                    name="housePrice"
                    value={inputs.housePrice}
                    onChange={handleInputChange}
                    placeholder="Enter house price"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>

                {/* Down Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Down Payment %" error={errors.downPaymentPercent}>
                    <Input
                      type="number"
                      name="downPaymentPercent"
                      value={inputs.downPaymentPercent}
                      onChange={handleInputChange}
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="Down Payment Amount">
                    <Input
                      type="number"
                      name="downPaymentAmount"
                      value={inputs.downPaymentAmount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      min="0"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>

                {/* Mortgage Details */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Interest Rate (%)" error={errors.mortgageRate}>
                    <Input
                      type="number"
                      name="mortgageRate"
                      value={inputs.mortgageRate}
                      onChange={handleInputChange}
                      placeholder="Annual rate"
                      step="0.125"
                      min="0"
                      max="20"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="Length (Years)" error={errors.mortgageYears}>
                    <Input
                      type="number"
                      name="mortgageYears"
                      value={inputs.mortgageYears}
                      onChange={handleInputChange}
                      placeholder="Loan term"
                      min="1"
                      max="50"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>

                {/* Location */}
                <InputWrapper label="Zipcode" error={errors.zipcode}>
                  <Input
                    type="text"
                    name="zipcode"
                    value={inputs.zipcode}
                    onChange={handleInputChange}
                    placeholder="Enter zipcode"
                    maxLength={5}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>

                {/* Appreciation */}
                <InputWrapper label="Annual Appreciation Rate (%)">
                  <Input
                    type="number"
                    name="appreciationRate"
                    value={inputs.appreciationRate}
                    onChange={handleInputChange}
                    placeholder="Enter rate"
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>

                {/* Insurance */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Annual Insurance">
                    <Input
                      type="number"
                      name="annualInsurance"
                      value={inputs.annualInsurance}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="Insurance Increase (%)">
                    <Input
                      type="number"
                      name="insuranceIncreaseRate"
                      value={inputs.insuranceIncreaseRate}
                      onChange={handleInputChange}
                      placeholder="Annual rate"
                      step="0.1"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>

                {/* Property Tax */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Annual Property Tax">
                    <Input
                      type="number"
                      name="propertyTax"
                      value={inputs.propertyTax}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="Tax Increase (%)">
                    <Input
                      type="number"
                      name="propertyTaxIncreaseRate"
                      value={inputs.propertyTaxIncreaseRate}
                      onChange={handleInputChange}
                      placeholder="Annual rate"
                      step="0.1"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>

                {/* HOA */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Monthly HOA">
                    <Input
                      type="number"
                      name="monthlyHOA"
                      value={inputs.monthlyHOA}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="HOA Increase (%)">
                    <Input
                      type="number"
                      name="hoaIncreaseRate"
                      value={inputs.hoaIncreaseRate}
                      onChange={handleInputChange}
                      placeholder="Annual rate"
                      step="0.1"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>

                {/* Closing Costs */}
                <InputWrapper label="Closing Costs (%)">
                  <Input
                    type="number"
                    name="closingCostPercent"
                    value={inputs.closingCostPercent}
                    onChange={handleInputChange}
                    placeholder="Enter percentage"
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>

                {/* Maintenance */}
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Annual Maintenance (%)">
                    <Input
                      type="number"
                      name="maintenancePercent"
                      value={inputs.maintenancePercent}
                      onChange={handleInputChange}
                      placeholder="Enter percentage"
                      step="0.1"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                  <InputWrapper label="Maintenance Amount">
                    <Input
                      type="number"
                      name="maintenanceAmount"
                      value={inputs.maintenanceAmount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                    />
                  </InputWrapper>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Calculate Purchase Analysis
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area - Charts */}
      <main className="p-6">
        {calculationResults && <BuyVisualizations monthlyData={calculationResults} />}
      </main>
    </div>
  );
};

export default BuyCalculator;