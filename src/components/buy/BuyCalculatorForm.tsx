import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BuyInputs } from '@/utils/calculations';
import InputWrapper from '@/components/ui/InputWrapper';

type ErrorState = {
  [K in keyof BuyInputs]?: string;
};

interface BuyCalculatorFormProps {
  onCalculate: (inputs: BuyInputs) => void;
}

const BuyCalculatorForm = ({ onCalculate }: BuyCalculatorFormProps) => {
  const [inputs, setInputs] = useState<BuyInputs>({
    housePrice: '650000',
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
    closingCostPercent: '8',
    maintenancePercent: '1',
    maintenanceAmount: '6500'
  });

  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    // Calculate initial results with default values
    if (validateInputs()) {
      onCalculate(inputs);
    }
  });

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
    
    if (errors[name as keyof BuyInputs]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: ErrorState = {};
    
    if (!inputs.housePrice) newErrors.housePrice = 'House price is required';
    if (!inputs.downPaymentPercent && !inputs.downPaymentAmount) {
      newErrors.downPaymentPercent = 'Either down payment percentage or amount is required';
    }
    if (!inputs.mortgageRate) newErrors.mortgageRate = 'Mortgage rate is required';
    if (!inputs.mortgageYears) newErrors.mortgageYears = 'Mortgage length is required';
    if (!inputs.zipcode) newErrors.zipcode = 'Zipcode is required';
    
    if (inputs.mortgageRate && (parseFloat(inputs.mortgageRate) <= 0 || parseFloat(inputs.mortgageRate) > 20)) {
      newErrors.mortgageRate = 'Please enter a valid interest rate between 0 and 20%';
    }

    if (inputs.mortgageYears && (parseFloat(inputs.mortgageYears) < 1 || parseFloat(inputs.mortgageYears) > 50)) {
      newErrors.mortgageYears = 'Please enter a valid term between 1 and 50 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      onCalculate(inputs);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2">
      <div className="space-y-4">
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
  );
};

export default BuyCalculatorForm;