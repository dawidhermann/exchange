import * as React from 'react';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CurrencyList from './currencyList/CurrencyList';
import ExchangeInput from './exchangeInput/ExchangeInput';
import * as Labels from '../../labels';
import Loader from '../common/loader/Loader';
import { getLatestExchangeValue } from './requests';
import AppToolbar from '../common/toolbar/Toolbar';
import useToolbar from '../common/toolbar/useToolbar';
import InfoDialog, { DialogType } from '../common/dialog/InfoDialog';
import './ExchangeContainer.css';

interface ValueUpdater<T> {
    (value: T): void;
}

export const CurrencyContext: React.Context<ValueUpdater<string>|null> = React.createContext<ValueUpdater<string>|null>(null);
export const ExchangeContext: React.Context<ValueUpdater<number>|null> = React.createContext<ValueUpdater<number>|null>(null);

export default function ExchangeContainer(): JSX.Element {
    const [ currencyList, setCurrencyList ] = React.useState<string[]>([]);
    const [ showLoader, setShowLoader ] = React.useState<boolean>(false);
    const [ showError, setShowError ] = React.useState<boolean>(false);
    const [ toolbarTitle ] = React.useState<string>(Labels.TITLE);
    const [ exchangeData, setExchangeData ] = React.useState<IExchangeRates>();
    const [ exchangeValue, setExchangeValue ] = React.useState<number>(1);
    const [ sourceCurrency, setSourceCurrency ] = React.useState<string>("");
    const [ targetCurrency, setTargetCurrency ] = React.useState<string>("");
    const setTitle = useToolbar();

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
            setTitle(`Currency exchange from ${ sourceCurrency }`);
        }, (): void => {
            setShowError(true);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [sourceCurrency]);

    const targetCurrencyList: string[] = React.useMemo((): string[] => {
        return currencyList.filter((currency: string): boolean => {
            return !_.isEqual(currency, sourceCurrency);
        });
    }, [sourceCurrency, showError]);

    if (showError) {
        return <InfoDialog message={Labels.FETCHING_ERROR} isOpen={showError} dialogType={DialogType.ERROR} />
    }

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
        <React.Fragment>
            <AppToolbar title={toolbarTitle} />
            <div className="mainContainer">
                <div className="root">
                    <ExchangeContext.Provider value={exchangeValueHandler}>
                        <ExchangeInput value={exchangeValue} label={Labels.EXCHANGE_VALUE} />
                    </ExchangeContext.Provider>
                    <ExchangeInput value={getExchangeResult(exchangeResult)} label={Labels.EXCHANGE_RESULT} disabled />
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
        </React.Fragment>
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