import * as React from 'react';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CurrencyList from './currencyList/CurrencyList';
import ExchangeInput from './exchangeInput/ExchangeInput';
import * as Labels from '../../labels';
import Loader from '../common/Loader';
import { getLatestExchangeValue } from './requests';
import './ExchangeContainer.css';

export interface ContextUpdater<T> {
    (value: T): void;
}

export const CurrencyContext: React.Context<ContextUpdater<string>|null> = React.createContext<ContextUpdater<string>|null>(null);
export const ExchangeContext: React.Context<ContextUpdater<number>|null> = React.createContext<ContextUpdater<number>|null>(null);

export default function ExchangeContainer(): JSX.Element {
    const [ currencyList, setCurrencyList ] = React.useState<string[]>([]);
    const [ showLoader, setShowLoader ] = React.useState<boolean>(false);
    const [ exchangeData, setExchangeData ] = React.useState<IExchangeRates>();
    const [ exchangeValue, setExchangeValue ] = React.useState<number>(1);
    const [ sourceCurrency, setSourceCurrency ] = React.useState<string>("");
    const [ targetCurrency, setTargetCurrency ] = React.useState<string>("");
    
    React.useEffect(() => {
        setShowLoader(true);
        const observable: Observable<Promise<IExchangeResult>> = from(getLatestExchangeValue(sourceCurrency))
            .pipe(map((pendingResult: Response): Promise<IExchangeResult> => {
                return pendingResult.json();
            }));
        const subscription = observable.subscribe(async (result: Promise<IExchangeResult>): Promise<void> => {
            const data = await result;
            const exchangeDataList: string[] = [data.base].concat(Object.keys(data.rates));
            if (_.isEmpty(currencyList)) {
                setCurrencyList(exchangeDataList);
            }
            if (_.isEmpty(sourceCurrency)) {
                setSourceCurrency(data.base);
            }
            setExchangeData(data.rates);
            setTimeout(() => setShowLoader(false), 500);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [sourceCurrency]);

    const targetCurrencyList: string[] = React.useMemo((): string[] => {
        return currencyList.filter((currency: string): boolean => {
            return !_.isEqual(currency, sourceCurrency);
        });
    }, [sourceCurrency]);

    if (showLoader || _.isEmpty(currencyList)) {
        return <Loader />;
    }

    if (!_.isEmpty(targetCurrencyList) && !targetCurrencyList.includes(targetCurrency)) {
        setTargetCurrency(targetCurrencyList[0]);
    }
    const exchangeRate: number = _.get(exchangeData, targetCurrency, 0);
    const exchangeResult: number = exchangeValue * exchangeRate;
    const exchangeValueHandler = (value: number): void => {
        const inputTextValue = String(value);
        if (inputTextValue.length <= 20) {
            setExchangeValue(value);
        }
    }

    return (
        <div className="mainContainer">
            <div className="root">
                <ExchangeContext.Provider value={exchangeValueHandler}>
                    <ExchangeInput value={exchangeValue} label={Labels.EXCHANGE_VALUE}/>
                </ExchangeContext.Provider>
                <ExchangeInput value={getExchangeResult(exchangeResult)} label={Labels.EXCHANGE_RESULT} disabled/>
            </div>
            <div className="root">
                <CurrencyContext.Provider value={setSourceCurrency}>
                    <CurrencyList currencyList={currencyList} selectedCurrency={sourceCurrency} label={Labels.SOURCE_CURRENCY} />
                </CurrencyContext.Provider>
                <CurrencyContext.Provider value={setTargetCurrency}>
                    <CurrencyList currencyList={targetCurrencyList} selectedCurrency={targetCurrency} label={Labels.TARGET_CURRENCY} />
                </CurrencyContext.Provider>
            </div>
        </div>
    );
}

function getExchangeResult(exchange: number): string {
    const exchangeStr: string = String(exchange);
    const index: number = exchangeStr.indexOf(".");
    if (index !== -1 && exchangeStr.indexOf("e") === -1) {
        return exchangeStr.substr(0, index + 3);
    }
    return exchangeStr;
}