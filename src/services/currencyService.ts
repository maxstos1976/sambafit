
export interface ExchangeRates {
  [key: string]: number;
}

export const fetchExchangeRates = async (base: string = 'EUR'): Promise<ExchangeRates> => {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback rates if API fails
    return {
      'EUR': 1,
      'USD': 1.08,
      'BRL': 5.50,
      'GBP': 0.85,
      'JPY': 165.00
    };
  }
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
