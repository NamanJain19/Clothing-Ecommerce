export const CURRENCY_SYMBOL = '₹';

/**
 * Formats a number to Indian Rupee currency format (e.g. ₹1,499 or ₹14,990)
 */
export const formatPrice = (amount: number, includeDecimals = false): string => {
  if (isNaN(amount)) return `${CURRENCY_SYMBOL}0`;
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  });
  return `${CURRENCY_SYMBOL}${formatted}`;
};
