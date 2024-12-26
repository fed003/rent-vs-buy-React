const Assumptions = () => {

  return (
    <section className="p-6">
      <h3>Assumptions</h3>
      <div className="p-6">
        <p>Here are the considerations we used to calculate the cost of buying vs renting:</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-bold mb-2">Buying Considerations</h4>
            <ul className="list-disc pl-4">
              <li>Home Price</li>
              <li>Down Payment</li>
              <li>Loan Term</li>
              <li>Interest Rate</li>
              <li>Property Taxes</li>
              <li>Homeowners Insurance</li>
              <li>PMI</li>
              <li>HOA Fees</li>
              <li>Maintenance</li>
              <li>Home Appreciation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Renting Considerations</h4>
            <ul className="list-disc pl-4">
              <li>Monthly Rent</li>
              <li>Renters Insurance</li>
              <li>Annual Rent Increase</li>
              <li>
                Investment Return Rate
                <ul className="list-disc pl-4">
                  <li>Initial investment amount will be the downpayment plus purchase closing costs.</li>
                  <li>If the montly payments to buy exceed the monthly expenses to rent, the difference will be added to the investment principal each month, and will accrue interest beginning the following month.</li>
                  <li>Investment return rate will be the annual rate of return on the investment.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="mt-4">
          <ol>
            <li>Home Price: The price of the home you are considering.</li>
            <li>Down Payment: The amount of money you will put down on the home.</li>
            <li>Loan Term: The length of the loan in years.</li>
            <li>Interest Rate: The interest rate on the loan.</li>
            <li>Property Taxes: The annual property taxes on the home.</li>
            <li>Homeowners Insurance: The annual cost of homeowners insurance.</li>
            <li>PMI: The annual cost of private mortgage insurance, if applicable.</li>
            <li>HOA Fees: The monthly cost of homeowners association fees, if applicable.</li>
            <li>Maintenance: The annual cost of home maintenance and repairs.</li>
            <li>Appreciation: The annual rate of home price appreciation.</li>
            <li>Rent: The monthly rent you would pay for a similar home.</li>
            <li>Investment Return: The annual rate of return on your investments.</li>
            <li>Rent Increase: The annual rate of rent increase.</li>
            <li>Years: The number of years you plan to stay in the home.</li>
          </ol>
      </div> */}
    </div>
  </section>
  );
};

export default Assumptions;