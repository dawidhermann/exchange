const BASE_URL = "https://api.exchangeratesapi.io/";

export function getLatestExchangeValue(sourceCurrency = ""): Promise<Response> {
    return fetch(`${ BASE_URL }latest?base=${ sourceCurrency }`);
}