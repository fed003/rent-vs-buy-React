import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputWrapper from '@/components/ui/InputWrapper';
import { RentInputs } from '@/utils/calculations';

type ErrorState = {
  [K in keyof RentInputs]?: string;
};

interface RentCalculatorFormProps {
  onCalculate: (inputs: RentInputs, monthsToCalculate: number) => void;
  monthsToCalculate: number;
}

const RentCalculatorForm = ({ onCalculate, monthsToCalculate }: RentCalculatorFormProps) => {
  const [inputs, setInputs] = useState<RentInputs>({
    monthlyRent: '2500',
    rentIncreaseRate: '3',
    rentersInsurance: '300',
    initialInvestment: '125000', // Default to typical down payment + closing costs
    investmentReturnRate: '7'
  });

  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    // Calculate initial results with default values
    if (validateInputs()) {
      onCalculate(inputs, monthsToCalculate);
    }
  }, [monthsToCalculate, inputs]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof RentInputs]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: ErrorState = {};
    
    // Required fields
    if (!inputs.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';
    if (!inputs.rentIncreaseRate) newErrors.rentIncreaseRate = 'Rent increase rate is required';
    if (!inputs.initialInvestment) newErrors.initialInvestment = 'Initial investment amount is required';
    if (!inputs.investmentReturnRate) newErrors.investmentReturnRate = 'Investment return rate is required';
    
    // Validate rates are reasonable
    if (inputs.rentIncreaseRate && (parseFloat(inputs.rentIncreaseRate) < 0 || parseFloat(inputs.rentIncreaseRate) > 20)) {
      newErrors.rentIncreaseRate = 'Please enter a valid rate between 0 and 20%';
    }
    
    if (inputs.investmentReturnRate && (parseFloat(inputs.investmentReturnRate) < -20 || parseFloat(inputs.investmentReturnRate) > 20)) {
      newErrors.investmentReturnRate = 'Please enter a valid rate between -20 and 20%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      onCalculate(inputs, monthsToCalculate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2">
      <div className="space-y-4">
        {/* Monthly Rent */}
        <InputWrapper label="Monthly Rent" error={errors.monthlyRent}>
          <Input
            type="number"
            name="monthlyRent"
            value={inputs.monthlyRent}
            onChange={handleInputChange}
            placeholder="Enter monthly rent"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        {/* Rent Increase Rate */}
        <InputWrapper 
          label="Annual Rent Increase (%)" 
          error={errors.rentIncreaseRate}
          helpText="Expected yearly increase in rent"
        >
          <Input
            type="number"
            name="rentIncreaseRate"
            value={inputs.rentIncreaseRate}
            onChange={handleInputChange}
            placeholder="Enter percentage"
            step="0.1"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        {/* Renter's Insurance */}
        <InputWrapper 
          label="Annual Renter's Insurance" 
          error={errors.rentersInsurance}
        >
          <Input
            type="number"
            name="rentersInsurance"
            value={inputs.rentersInsurance}
            onChange={handleInputChange}
            placeholder="Enter annual amount"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        {/* Initial Investment */}
        <InputWrapper 
          label="Initial Investment" 
          error={errors.initialInvestment}
          helpText="Amount available for investment (equivalent to down payment + closing costs if buying)"
        >
          <Input
            type="number"
            name="initialInvestment"
            value={inputs.initialInvestment}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>

        {/* Investment Return Rate */}
        <InputWrapper 
          label="Investment Return Rate (%)" 
          error={errors.investmentReturnRate}
          helpText="Expected annual return on investments"
        >
          <Input
            type="number"
            name="investmentReturnRate"
            value={inputs.investmentReturnRate}
            onChange={handleInputChange}
            placeholder="Enter percentage"
            step="0.1"
            className="bg-background border-2 focus:border-primary hover:bg-accent hover:bg-opacity-50"
          />
        </InputWrapper>
      </div>

      <Button type="submit" className="w-full">
        Calculate Rent Analysis
      </Button>
    </form>
  );
};

export default RentCalculatorForm;