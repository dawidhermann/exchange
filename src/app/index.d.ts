interface IExchangeRates {
    [s: string]: number;
}

interface IExchangeResult {
    base: string;
    rates: IExchangeRates;
    date: string;
}