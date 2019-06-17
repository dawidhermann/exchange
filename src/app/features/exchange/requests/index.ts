const BASE_URL = "https://api.exchangeratesapi.ido/";

export function getLatestExchangeValue(sourceCurrency = ""): Promise<Response> {
    return fetch(`${ BASE_URL }latest?base=${ sourceCurrency }`);
}