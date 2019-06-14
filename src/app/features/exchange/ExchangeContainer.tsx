import * as React from 'react';
import Button from '@material-ui/core/Button';
import CurrencyList from './currencyList/CurrencyList';
import ExchangeInput from './exchangeInput/ExchangeInput';
import * as Labels from '../../labels';
import './ExchangeContainer.css';
import Loader from '../common/Loader';

export const CurrencyContext: React.Context<(value: string) => void> = React.createContext(null);
export const ExchangeContext: React.Context<(value: number) => void> = React.createContext(null);

export default function ExchangeContainer(): JSX.Element {
    const [ currencyList, setCurrencyList ] = React.useState<string[]>([]);
    const [ exchangeList, setExchangeList ] = React.useState<string[]>([]);
    const [ exchangeValue, setExchangeValue ] = React.useState<number>(1);
    const [ sourceCurrency, setSourceCurrency ] = React.useState<string>("");
    const [ targetCurrency, setTargetCurrency ] = React.useState<string>("");

    if (currencyList.length === 0 || exchangeList.length === 0) {
        return <Loader />;
    }

    return (
        <div>
            <div className="root">
            <ExchangeContext.Provider value={setExchangeValue}>
                <ExchangeInput value={exchangeValue}/>
            </ExchangeContext.Provider>
            <p className="resultContainer">{exchangeValue * 2}</p>
            </div>
            <div className="root">
            <CurrencyContext.Provider value={setSourceCurrency}>
                <CurrencyList currencyList={['us', 'eur']} selectedCurrency={sourceCurrency} label={Labels.SOURCE_CURRENCY} />
            </CurrencyContext.Provider>
            <CurrencyContext.Provider value={setTargetCurrency}>
                <CurrencyList currencyList={['us', 'eur']} selectedCurrency={targetCurrency} label={Labels.TARGET_CURRENCY} />
            </CurrencyContext.Provider>
            </div>
            {/* <Button variant="contained" color="primary">
                {Labels.CALCULATE_BTN}
            </Button> */}
        </div>
    );
}