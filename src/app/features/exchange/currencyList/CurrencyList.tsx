import * as React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { CurrencyContext } from '../ExchangeContainer';
import './CurrencyList.css';

interface ICurrencyListProps { 
    currencyList: string[];
    selectedCurrency: string;
    label: string;
}
export type CurrencyListProps = ICurrencyListProps;

export default function CurrencyList(props: CurrencyListProps) {
    const setCurrency = React.useContext(CurrencyContext);
    const selectItems: JSX.Element[] = props.currencyList.map((currency: string): JSX.Element => {
        return <MenuItem key={currency} value={currency}>{currency}</MenuItem>
    });
    const handleChange = (event: React.ChangeEvent<{ name?: string; value: string }>): void => {
        setCurrency(event.target.value);
    };

    return (
        <form autoComplete="off" className="currencyListSelect">
            <FormControl className="selectList">
                <InputLabel>{props.label}</InputLabel>
                <Select
                    value={props.selectedCurrency}
                    onChange={handleChange} 
                >
                    {selectItems}
                </Select>
            </FormControl>
        </form>
    );
}