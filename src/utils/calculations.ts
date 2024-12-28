export const filterData = (data: any[]) => {
	return data
		.filter((_, index) => (index + 1) % 12 === 0)
		.map((month, index) => ({
			...month,
			year: index + 1,
		}));
};

export const roundToDecimals = (value: number, decimals: number): number => {
	const multiplier = Math.pow(10, decimals);
	return Math.round(value * multiplier) / multiplier;
};

export const roundToDecimalsString = (
	value: number,
	decimals: number
): string => {
	return roundToDecimals(value, decimals).toString();
};

// Types
export interface BuyInputs {
	housePrice: string;
	downPaymentType: "percent" | "amount";
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
}

interface MonthlyInvestmentData {
	principal: number;
	interestToDate: number;
	investmentValue: number;
	capitalGains: number;
	capitalGainsTax: number;
	netValueAfterTax: number;
}

export interface BuyMonthlyData extends MonthlyInvestmentData {
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
	netValue: number;
	cumulativePayments: number;
	cumulativeMaintenance: number;
	taxDeductions: number;
	taxSavings: number;
	cumulativeTaxSavings: number;
	netValueAfterDeductions: number;
	// investmentPrincipal: number;
	// investmentInterest: number;
	// investmentValue: number;
}

export interface RentMonthlyData extends MonthlyInvestmentData {
	month: number;
	rent: number;
	insurance: number;
	totalMonthly: number;
	// principal: number;
	// interestToDate: number;
	// investmentValue: number;
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

const calculateMonthlyAppreciationRate = (
	appreciationRate: string,
	month: number
): number => {
	return (
		Math.pow(1 + parseFloat(appreciationRate) / 100, ((month % 12) + 1) / 12) -
		Math.pow(1 + parseFloat(appreciationRate) / 100, (month % 12) / 12)
	);
};

export const generateBuyMonthlyData = (inputs: BuyInputs): BuyMonthlyData[] => {
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
	let cumulativeMaintenance = 0;
	let cumulativeTaxSavings = 0;
	const monthlyRate = parseFloat(mortgageRate) / 100 / 12;
	const monthlyData: BuyMonthlyData[] = [];
	const totalMonths = parseFloat(mortgageYears) * 12;

	let currentHouseValue = parseFloat(housePrice);
	let currentInsurance = parseFloat(annualInsurance) / 12;
	let currentPropertyTax = parseFloat(propertyTax) / 12;
	let currentHOA = parseFloat(monthlyHOA);

	let currentMaintenance = maintenancePercent
		? (currentHouseValue * parseFloat(maintenancePercent)) / 100 / 12
		: parseFloat(maintenanceAmount) / 12;

	for (let month = 0; month < totalMonths; month++) {
		const monthlyInterest = currentPrincipal * monthlyRate;
		const monthlyPrincipal = monthlyPayment - monthlyInterest;
		const monthlyPMI = calculatePMI(currentHouseValue, currentPrincipal);

		//	Increase house value based on appreciation rate
		const monthlyAppreciationRate = calculateMonthlyAppreciationRate(
			appreciationRate,
			month
		);
		currentHouseValue *= 1 + monthlyAppreciationRate;

		// Calculate tax savings at the end of each year or on the final month
		const taxSavings = calculateTaxSavings(
			monthlyInterest,
			currentPropertyTax,
			parseFloat(federalTaxRate),
			parseFloat(stateTaxRate)
		);
		cumulativeTaxSavings += taxSavings;

		//	Update insurance, property tax, and HOA annually
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

		// Update the cumulative maintenance
		cumulativeMaintenance += currentMaintenance;

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
			cumulativePayments: cumulativePayments,
			cumulativeMaintenance: cumulativeMaintenance,
			taxDeductions: monthlyInterest + currentPropertyTax,
			// taxDeductions: yearlyInterestPaid + yearlyPropertyTaxPaid,
			taxSavings: taxSavings,
			cumulativeTaxSavings: cumulativeTaxSavings,
			netValue: 0,
			netValueAfterDeductions: 0,
			//	All investment data starts at 0, will add when we go through the rent data
			principal: 0,
			interestToDate: 0,
			investmentValue: 0,
			capitalGains: 0,
			capitalGainsTax: 0,
			netValueAfterTax: 0,
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
	const { monthlyRent, rentIncreaseRate, rentersInsurance } = inputs;

	let currentRent = parseFloat(monthlyRent);
	let currentInsurance = parseFloat(rentersInsurance) / 12;
	let cumulativePayments = 0;
	const monthlyData: RentMonthlyData[] = [];

	for (let month = 0; month < numberOfMonths; month++) {
		// Update rent and insurance annually
		if (month > 0 && month % 12 === 0) {
			currentRent *= 1 + parseFloat(rentIncreaseRate) / 100;
			// Assuming insurance increases at the same rate as rent
			currentInsurance *= 1 + parseFloat(rentIncreaseRate) / 100;
		}

		const totalMonthly = currentRent + currentInsurance;
		cumulativePayments += totalMonthly;

		monthlyData.push({
			month: month + 1,
			rent: currentRent,
			insurance: currentInsurance,
			totalMonthly: totalMonthly,
			cumulativePayments: cumulativePayments,
			netValue: 0,
			principal: 0,
			interestToDate: 0,
			investmentValue: 0,
			capitalGains: 0,
			capitalGainsTax: 0,
			netValueAfterTax: 0,
		});
	}

	return monthlyData;
};

export const generateMonthlyData = (
	inputs: CalculationInputs
): {
	buyData: BuyMonthlyData[];
	rentData: RentMonthlyData[];
} => {
	const capitalGainsTaxRate = 0.15;
	const { buyInputs, rentInputs } = inputs;
	const numberOfMonths = parseInt(buyInputs.mortgageYears) * 12;

	// Initialize both datasets
	const buyData = generateBuyMonthlyData(buyInputs);
	const rentData = generateRentMonthlyData(rentInputs, numberOfMonths);

	//	We'll have to store the first month where we have an investment on the buy side, so we can calcualte the
	//	interest rate properly
	let firstBuyInvestmentMonth = 0;

	//	Set the initial investment principal and total value
	rentData[0].principal =
		parseFloat(buyInputs.downPaymentAmount) +
		(parseFloat(buyInputs.housePrice) *
			parseFloat(buyInputs.buyClosingCostPercent)) /
			100;
	rentData[0].investmentValue = rentData[0].principal;

	// For each month, calculate the cost differential and invest it
	for (let month = 1; month < numberOfMonths; month++) {
		const buyMonthly = buyData[month].totalMonthly;
		const rentMonthly = rentData[month].totalMonthly;
		const monthlyDiff = buyMonthly - rentMonthly;

		//	Generate the new rental investment data
		const monthlyReturnRate = calculateMonthlyAppreciationRate(
			rentInputs.investmentReturnRate,
			month
		);
		// Calculate the new month's interest
		const newRentInterest =
			rentData[month - 1].investmentValue * monthlyReturnRate;
		//	Add any new investment principal
		rentData[month].principal =
			rentData[month - 1].principal + (monthlyDiff > 0 ? monthlyDiff : 0);
		//	Add the new month's interest
		rentData[month].interestToDate =
			rentData[month - 1].interestToDate + newRentInterest;
		//	Update the new total value
		rentData[month].investmentValue =
			rentData[month].principal + rentData[month].interestToDate;
		//	Calculate the new value
		rentData[month].netValue =
			rentData[month].investmentValue - rentData[month].cumulativePayments;
		//	Calculate the capital gains
		rentData[month].capitalGains = rentData[month].interestToDate;
		//	Calculate the capital gains tax
		rentData[month].capitalGainsTax =
			rentData[month].capitalGains * capitalGainsTaxRate;
		//	Calculate the net value after tax
		rentData[month].netValueAfterTax =
			rentData[month].netValue - rentData[month].capitalGainsTax;

		//	Generate the new buy investment data, but only if buy costs have fallen below rent costs
		if (monthlyDiff < 0) {
			if (firstBuyInvestmentMonth === 0) {
				firstBuyInvestmentMonth = month;
			}
			const buyMonthlyReturnRate = calculateMonthlyAppreciationRate(
				rentInputs.investmentReturnRate,
				month - firstBuyInvestmentMonth
			);

			const newBuyInterest =
				buyData[month - 1].investmentValue * buyMonthlyReturnRate;
			buyData[month].principal = buyData[month - 1].principal + -monthlyDiff;
			buyData[month].interestToDate =
				buyData[month - 1].interestToDate + newBuyInterest;
			buyData[month].investmentValue =
				buyData[month].principal + buyData[month].interestToDate;
		}
		// Calculate selling costs
		const sellingCosts =
			buyData[month].houseValue *
			(parseFloat(buyInputs.sellClosingCostPercent) / 100);
		// Calculate net values
		buyData[month].netValue =
			buyData[month].equity - sellingCosts - buyData[month].cumulativePayments;
		// Calculate net value after deductions
		buyData[month].netValueAfterDeductions =
			buyData[month].netValue + buyData[month].cumulativeTaxSavings;
		//	Calculate the capital gains
		const houseSaleGains =
			buyData[month].houseValue -
			parseFloat(buyInputs.housePrice) -
			buyData[month].cumulativeMaintenance;
		const investmentGains =
			buyData[month].investmentValue - buyData[month].principal;
		buyData[month].capitalGains = houseSaleGains + investmentGains;
		//	Calculate the capital gains tax - only on the investment gains above $250,000
		buyData[month].capitalGainsTax =
			Math.max(buyData[month].capitalGains - 250000, 0) * capitalGainsTaxRate;
		//	Calculate the net value after tax
		buyData[month].netValueAfterTax =
			buyData[month].netValue - buyData[month].capitalGainsTax;
	}

	return { buyData, rentData };
};
