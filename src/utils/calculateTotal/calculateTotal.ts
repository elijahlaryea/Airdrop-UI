function calculateTotalAmount(amounts: string): number {
  const amountsArray = amounts
    .split(/[\n,]+/) // Split by comma or newline
    .map((singleAmount) => singleAmount.trim()) // Trim whitespace
    .filter((singleAmount) => singleAmount !== "") // Filter out empty strings
    .map((singleAmount) => parseFloat(singleAmount)); // Convert to numbers

  // Filter out NaN values and sum the rest
  return amountsArray
    .filter((singleAmount) => !isNaN(singleAmount))
    .reduce((sum, singleAmount) => sum + singleAmount, 0);
}

export default calculateTotalAmount;
