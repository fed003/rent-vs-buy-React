import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputWrapper from '@/components/ui/InputWrapper';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BuyInputs, RentInputs, CalculationInputs, roundToDecimalsString } from '@/utils/calculations';

type CalculationType = 'buy' | 'rent';

interface CalculatorFormProps {
  buyInputValues: BuyInputs | null;
  rentInputValues: RentInputs | null;
  onCalculate: (inputs: CalculationInputs ) => void;
}

const CalculatorForm = ({ buyInputValues, rentInputValues, onCalculate }: CalculatorFormProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [calculationType, setCalculationType] = useState<CalculationType>('buy');

  // Buy inputs state
  const [buyInputs, setBuyInputs] = useState<BuyInputs>(
    buyInputValues ??
    {
      housePrice: '650000',
      downPaymentType: 'percent',
      downPaymentPercent: '20',
      downPaymentAmount: '130000',
      mortgageRate: '6.5',
      mortgageYears: '30',
      zipcode: '92101',
      appreciationRate: '3',
      annualInsurance: '2000',
      insuranceIncreaseRate: '3',
      propertyTax: '7150',
      propertyTaxIncreaseRate: '2',
      monthlyHOA: '600',
      hoaIncreaseRate: '3',
      buyClosingCostPercent: '2',
      sellClosingCostPercent: '8',
      maintenancePercent: '1',
      maintenanceAmount: '6500',
      federalTaxRate: '18',
      stateTaxRate: '7'
    }
  );

  const calculateInitialInvestment = () => {
    const downPayment = parseFloat(buyInputs.downPaymentAmount);
    const closingCosts = parseFloat(buyInputs.housePrice) * (parseFloat(buyInputs.buyClosingCostPercent) / 100);
    if (!isNaN(downPayment) && !isNaN(closingCosts)) {
      return downPayment + closingCosts;
    }
    return 0;
  };

  // Rent inputs state
  const [rentInputs, setRentInputs] = useState<RentInputs>(
    rentInputValues ??
    {
      monthlyRent: '3250',
      rentIncreaseRate: '5',
      rentersInsurance: '200',
      initialInvestment: calculateInitialInvestment().toString(),
      investmentReturnRate: '7'
    }
  );

  // Update advanced buy inputs when house price changes
  useEffect(() => {
    const housePrice = parseFloat(buyInputs.housePrice);

    if (buyInputs.downPaymentType === 'percent') {
      updateDownPayment(buyInputs.downPaymentPercent, 'percent');
    }
    else {
      updateDownPayment(buyInputs.downPaymentAmount, 'amount');
    }

    if (!isNaN(housePrice)) {
      setBuyInputs(prev => ({
        ...prev,
        annualInsurance: (housePrice * 0.004).toString(), // 0.4% of house price
        propertyTax: (housePrice * 0.01195).toString(), // 1.195% of house price
        maintenanceAmount: (housePrice * 0.01).toString(), // 1% of house price
      }));
    }
  }, [buyInputs.housePrice]);

  // Update rent initial investment when down payment changes
  useEffect(() => {
      setRentInputs(prev => ({
        ...prev,
        initialInvestment: calculateInitialInvestment().toString()
      }));
  }, [buyInputs.downPaymentAmount, buyInputs.housePrice, buyInputs.buyClosingCostPercent]);

  const setDownPaymentType = (type: 'percent' | 'amount') => {
    setBuyInputs(prev => ({
      ...prev,
      downPaymentType: type
    }));
  }

  const updateDownPayment = (newValue: string, type: 'percent' | 'amount') => {
    if (!buyInputs.housePrice) return;
    
    let downPaymentAmount: number;
    let downPaymentPercent: number;

    if (type === 'percent') {
      downPaymentPercent = parseFloat(newValue);
      if (isNaN(downPaymentPercent)) return;
      downPaymentAmount = (parseFloat(buyInputs.housePrice) * downPaymentPercent) / 100;
    } else {
      downPaymentAmount = parseFloat(newValue);
      if (isNaN(downPaymentAmount)) return;
      downPaymentPercent = (downPaymentAmount / parseFloat(buyInputs.housePrice)) * 100;
    }

    setBuyInputs(prev => ({
      ...prev,
      downPaymentPercent: roundToDecimalsString(downPaymentPercent, 2),
      downPaymentAmount: roundToDecimalsString(downPaymentAmount, 2),
    }));
  };

  const setDownPaymentPercent = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (buyInputs.downPaymentType !== 'percent') return;
    updateDownPayment(value, 'percent');
  }

  const setDownPaymentAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (buyInputs.downPaymentType !== 'amount') return;
    updateDownPayment(value, 'amount');
  }

  const handleBuyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRentInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    const inputs: CalculationInputs = {
      buyInputs,
      rentInputs,
    };
    onCalculate(inputs);
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-6 px-2">
      <Tabs value={calculationType} onValueChange={(value) => setCalculationType(value as CalculationType)}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          {/* Primary Buy Inputs */}
          <InputWrapper label="House Price" helpText="Enter the total purchase price of the home">
            <Input
              type="number"
              name="housePrice"
              value={buyInputs.housePrice}
              onChange={handleBuyInputChange}
              className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
            />
          </InputWrapper>

          <InputWrapper label="Down Payment Type">
            <div className="flex rounded-md overflow-hidden">
              <Button
                type="button"
                variant={buyInputs.downPaymentType === 'percent' ? 'default' : 'secondary'}
                onClick={() => setDownPaymentType('percent')}
                className="flex-1 rounded-none"
              >
                Percent
              </Button>
              <Button
                type="button"
                variant={buyInputs.downPaymentType === 'amount' ? 'default' : 'secondary'}
                onClick={() => setDownPaymentType('amount')}
                className="flex-1 rounded-none"
              >
                Amount
              </Button>
            </div>
          </InputWrapper>

          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="Down Payment %">
              <Input
                type="number"
                name="downPaymentPercent"
                value={buyInputs.downPaymentPercent}
                onChange={setDownPaymentPercent}
                min="0"
                max="100"
                step="0.1"
                className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                disabled={buyInputs.downPaymentType === 'amount'}
              />
            </InputWrapper>
            <InputWrapper label="Down Payment Amount">
              <Input
                type="number"
                name="downPaymentAmount"
                value={buyInputs.downPaymentAmount}
                onChange={setDownPaymentAmount}
                className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                disabled={buyInputs.downPaymentType === 'percent'}
              />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="Mortgage Rate (%)">
              <Input
                type="number"
                name="mortgageRate"
                value={buyInputs.mortgageRate}
                onChange={handleBuyInputChange}
                step="0.125"
                className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
              />
            </InputWrapper>
            <InputWrapper label="Mortgage Term (Years)">
              <Input
                type="number"
                name="mortgageYears"
                value={buyInputs.mortgageYears}
                onChange={handleBuyInputChange}
                min="1"
                max="50"
                className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
              />
            </InputWrapper>
          </div>

          <InputWrapper label="Zipcode">
            <Input
              type="text"
              name="zipcode"
              value={buyInputs.zipcode}
              onChange={handleBuyInputChange}
              maxLength={5}
              className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
            />
          </InputWrapper>

          {/* Advanced Buy Settings */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-4 border rounded-lg"
              >
                <span>Advanced Settings</span>
                {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <InputWrapper label="Annual Appreciation Rate (%)" helpText="Expected yearly increase in home value">
                <Input
                  type="number"
                  name="appreciationRate"
                  value={buyInputs.appreciationRate}
                  onChange={handleBuyInputChange}
                  step="0.1"
                  className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Annual Insurance">
                  <Input
                    type="number"
                    name="annualInsurance"
                    value={buyInputs.annualInsurance}
                    onChange={handleBuyInputChange}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="Insurance Increase (%)">
                  <Input
                    type="number"
                    name="insuranceIncreaseRate"
                    value={buyInputs.insuranceIncreaseRate}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Annual Property Tax">
                  <Input
                    type="number"
                    name="propertyTax"
                    value={buyInputs.propertyTax}
                    onChange={handleBuyInputChange}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="Tax Increase (%)">
                  <Input
                    type="number"
                    name="propertyTaxIncreaseRate"
                    value={buyInputs.propertyTaxIncreaseRate}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Monthly HOA">
                  <Input
                    type="number"
                    name="monthlyHOA"
                    value={buyInputs.monthlyHOA}
                    onChange={handleBuyInputChange}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="HOA Increase (%)">
                  <Input
                    type="number"
                    name="hoaIncreaseRate"
                    value={buyInputs.hoaIncreaseRate}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Buy Closing Costs (%)">
                  <Input
                    type="number"
                    name="buyClosingCostPercent"
                    value={buyInputs.buyClosingCostPercent}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="Sell Closing Costs (%)">
                  <Input
                    type="number"
                    name="sellClosingCostPercent"
                    value={buyInputs.sellClosingCostPercent}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Annual Maintenance (%)">
                  <Input
                    type="number"
                    name="maintenancePercent"
                    value={buyInputs.maintenancePercent}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="Maintenance Amount">
                  <Input
                    type="number"
                    name="maintenanceAmount"
                    value={buyInputs.maintenanceAmount}
                    onChange={handleBuyInputChange}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Federal Tax Rate (%)">
                  <Input
                    type="number"
                    name="federalTaxRate"
                    value={buyInputs.federalTaxRate}
                    onChange={handleBuyInputChange}
                    step="0.1"
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
                <InputWrapper label="State Tax Rate (%)">
                  <Input
                    type="number"
                    name="stateTaxRate"
                    value={buyInputs.stateTaxRate}
                    onChange={handleBuyInputChange}
                    className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
                  />
                </InputWrapper>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>

        <TabsContent value="rent" className="space-y-4">
        <InputWrapper label="Monthly Rent">
          <Input
            type="number"
            name="monthlyRent"
            value={rentInputs.monthlyRent}
            onChange={handleRentInputChange}
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        <InputWrapper 
          label="Annual Rent Increase (%)" 
          helpText="Expected yearly increase in rent"
        >
          <Input
            type="number"
            name="rentIncreaseRate"
            value={rentInputs.rentIncreaseRate}
            onChange={handleRentInputChange}
            step="0.1"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        <InputWrapper label="Annual Renter's Insurance">
          <Input
            type="number"
            name="rentersInsurance"
            value={rentInputs.rentersInsurance}
            onChange={handleRentInputChange}
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        <InputWrapper 
          label="Investment Return Rate (%)"
          helpText="Expected annual return on investments (down payment + closing costs)"
        >
          <Input
            type="number"
            name="investmentReturnRate"
            value={rentInputs.investmentReturnRate}
            onChange={handleRentInputChange}
            step="0.1"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>
      </TabsContent>

      {/* Submit Button - Outside of tabs content */}
      <Button type="submit" className="w-full my-4">
        Update Analysis
      </Button>
    </Tabs>
  </form>
  );
}

export default CalculatorForm;