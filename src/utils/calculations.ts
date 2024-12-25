// Types
export interface BuyInputs {
	housePrice: string;
	downPaymentPercent: string;
	downPaymentAmount: string;
	mortgageRate: string;
	mortgageYears: string;
	zipcode: string;
	appreciationRate: string;
	annualInsurance: string;
	insuranceIncreaseRate: string;
	propertyTax: string;
	propertyTaxIncreaseRate: string;
	monthlyHOA: string;
	hoaIncreaseRate: string;
	buyClosingCostPercent: string;
	sellClosingCostPercent: string;
	maintenancePercent: string;
	maintenanceAmount: string;
	federalTaxRate: string;
	stateTaxRate: string;
}

export interface RentInputs {
	monthlyRent: string;
	rentIncreaseRate: string;
	rentersInsurance: string;
	initialInvestment: string; // This will be the equivalent of down payment + closing costs
	investmentReturnRate: string;
}

export interface CalculationInputs {
	buyInputs: BuyInputs;
	rentInputs: RentInputs;
	monthsToCalculate: number;
}

export interface MonthlyData {
	month: number;
	houseValue: number;
	remainingPrincipal: number;
	payment: number;
	principalPaid: number;
	interestPaid: number;
	pmi: number;
	insurance: number;
	propertyTax: number;
	hoa: number;
	maintenance: number;
	totalMonthly: number;
	equity: number;
	netValue: number; // New field: house value - remaining principal - sell closing costs - cumulative payments
	cumulativePayments: number; // New field to track total payments made
	taxDeductions: number; // New field: accumulated tax deductions
	taxSavings: number; // New field: value of tax savings
	netValueAfterTax: number; // New field: net value including tax benefits
}

export interface RentMonthlyData {
	month: number;
	rent: number;
	insurance: number;
	investmentValue: number;
	totalMonthly: number;
	totalWealth: number; // investment value only since no equity
	netValue: number; // New field
	cumulativePayments: number; // New field
}

// Utility functions
const calculateMonthlyMortgage = (
	principal: number,
	annualRate: number,
	years: number = 30
): number => {
	const monthlyRate = annualRate / 100 / 12;
	const numberOfPayments = years * 12;

	return (
		(principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
		(Math.pow(1 + monthlyRate, numberOfPayments) - 1)
	);
};

const calculatePMI = (houseValue: number, loanBalance: number): number => {
	const ltv = (loanBalance / houseValue) * 100;
	if (ltv > 80) {
		return (loanBalance * 0.0075) / 12;
	}
	return 0;
};

const calculateTaxSavings = (
	interestPaid: number,
	propertyTax: number,
	federalTaxRate: number,
	stateTaxRate: number
): number => {
	const combinedTaxRate = (federalTaxRate + stateTaxRate) / 100;
	const deductibleAmount = interestPaid + propertyTax;
	return deductibleAmount * combinedTaxRate;
};

export const generateMonthlyData = (inputs: BuyInputs): MonthlyData[] => {
	const {
		housePrice,
		downPaymentAmount,
		mortgageRate,
		mortgageYears,
		appreciationRate,
		annualInsurance,
		insuranceIncreaseRate,
		propertyTax,
		propertyTaxIncreaseRate,
		monthlyHOA,
		hoaIncreaseRate,
		sellClosingCostPercent,
		maintenancePercent,
		maintenanceAmount,
		federalTaxRate,
		stateTaxRate,
	} = inputs;

	const loanAmount = parseFloat(housePrice) - parseFloat(downPaymentAmount);
	const monthlyPayment = calculateMonthlyMortgage(
		loanAmount,
		parseFloat(mortgageRate),
		parseFloat(mortgageYears)
	);

	let currentPrincipal = loanAmount;
	let cumulativePayments =
		parseFloat(downPaymentAmount) +
		(parseFloat(housePrice) * parseFloat(inputs.buyClosingCostPercent)) / 100;
	let cumulativeTaxSavings = 0;
	const monthlyRate = parseFloat(mortgageRate) / 100 / 12;
	const monthlyData: MonthlyData[] = [];
	const totalMonths = parseFloat(mortgageYears) * 12;

	let currentHouseValue = parseFloat(housePrice);
	let currentInsurance = parseFloat(annualInsurance) / 12;
	let currentPropertyTax = parseFloat(propertyTax) / 12;
	let currentHOA = parseFloat(monthlyHOA);
	let yearlyInterestPaid = 0;
	let yearlyPropertyTaxPaid = 0;
	let currentMaintenance = maintenancePercent
		? (currentHouseValue * parseFloat(maintenancePercent)) / 100 / 12
		: parseFloat(maintenanceAmount) / 12;

	for (let month = 0; month < totalMonths; month++) {
		const monthlyInterest = currentPrincipal * monthlyRate;
		const monthlyPrincipal = monthlyPayment - monthlyInterest;
		const monthlyPMI = calculatePMI(currentHouseValue, currentPrincipal);

		// Accumulate yearly deductible amounts
		yearlyInterestPaid += monthlyInterest;
		yearlyPropertyTaxPaid += currentPropertyTax;

		const monthlyAppreciationRate = parseFloat(appreciationRate) / 100 / 12;
		currentHouseValue *= 1 + monthlyAppreciationRate;

		// Calculate tax savings at the end of each year or on the final month
		if ((month + 1) % 12 === 0 || month === totalMonths - 1) {
			const annualTaxSavings = calculateTaxSavings(
				yearlyInterestPaid,
				yearlyPropertyTaxPaid,
				parseFloat(federalTaxRate),
				parseFloat(stateTaxRate)
			);
			cumulativeTaxSavings += annualTaxSavings;
			// Reset yearly accumulators
			yearlyInterestPaid = 0;
			yearlyPropertyTaxPaid = 0;
		}

		if (month > 0 && month % 12 === 0) {
			currentInsurance *= 1 + parseFloat(insuranceIncreaseRate) / 100;
			currentPropertyTax *= 1 + parseFloat(propertyTaxIncreaseRate) / 100;
			currentHOA *= 1 + parseFloat(hoaIncreaseRate) / 100;

			if (maintenancePercent) {
				currentMaintenance =
					(currentHouseValue * parseFloat(maintenancePercent)) / 100 / 12;
			} else {
				currentMaintenance *= 1 + parseFloat(appreciationRate) / 100;
			}
		}

		const totalMonthly =
			monthlyPayment +
			monthlyPMI +
			currentInsurance +
			currentPropertyTax +
			currentHOA +
			currentMaintenance;

		// Update cumulative payments
		cumulativePayments += totalMonthly;

		// Calculate selling costs
		const sellingCosts =
			currentHouseValue * (parseFloat(sellClosingCostPercent) / 100);

		// Calculate net values
		const netValue =
			currentHouseValue - currentPrincipal - sellingCosts - cumulativePayments;
		const netValueAfterTax = netValue + cumulativeTaxSavings;

		monthlyData.push({
			month: month + 1,
			houseValue: currentHouseValue,
			remainingPrincipal: currentPrincipal,
			payment: monthlyPayment,
			principalPaid: monthlyPrincipal,
			interestPaid: monthlyInterest,
			pmi: monthlyPMI,
			insurance: currentInsurance,
			propertyTax: currentPropertyTax,
			hoa: currentHOA,
			maintenance: currentMaintenance,
			totalMonthly: totalMonthly,
			equity: currentHouseValue - currentPrincipal,
			netValue: netValue,
			cumulativePayments: cumulativePayments,
			taxDeductions: yearlyInterestPaid + yearlyPropertyTaxPaid,
			taxSavings: cumulativeTaxSavings,
			netValueAfterTax: netValueAfterTax,
		});

		currentPrincipal -= monthlyPrincipal;
	}

	return monthlyData;
};

// Rent calculations
export const generateRentMonthlyData = (
	inputs: RentInputs,
	numberOfMonths: number
): RentMonthlyData[] => {
	const {
		monthlyRent,
		rentIncreaseRate,
		rentersInsurance,
		initialInvestment,
		investmentReturnRate,
	} = inputs;

	let currentRent = parseFloat(monthlyRent);
	let currentInsurance = parseFloat(rentersInsurance) / 12;
	let currentInvestmentValue = parseFloat(initialInvestment);
	let cumulativePayments = 0;
	const monthlyData: RentMonthlyData[] = [];

	for (let month = 0; month < numberOfMonths; month++) {
		// Calculate monthly investment return (compounding monthly)
		const monthlyReturnRate = parseFloat(investmentReturnRate) / 100 / 12;
		currentInvestmentValue *= 1 + monthlyReturnRate;

		// Update rent and insurance annually
		if (month > 0 && month % 12 === 0) {
			currentRent *= 1 + parseFloat(rentIncreaseRate) / 100;
			// Assuming insurance increases at the same rate as rent
			currentInsurance *= 1 + parseFloat(rentIncreaseRate) / 100;
		}

		const totalMonthly = currentRent + currentInsurance;
		cumulativePayments += totalMonthly;

		// Calculate net value (investment value minus all payments made)
		const netValue = currentInvestmentValue - cumulativePayments;

		monthlyData.push({
			month: month + 1,
			rent: currentRent,
			insurance: currentInsurance,
			investmentValue: currentInvestmentValue,
			totalMonthly: totalMonthly,
			totalWealth: currentInvestmentValue,
			netValue: netValue,
			cumulativePayments: cumulativePayments,
		});
	}

	return monthlyData;
};
