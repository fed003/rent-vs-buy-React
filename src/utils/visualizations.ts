export const dfltMargins = { top: 5, right: 10, left: 0, bottom: 10 };

export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
};
