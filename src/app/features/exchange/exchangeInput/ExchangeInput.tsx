import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { ExchangeContext } from '../ExchangeContainer';
import './ExchangeInput.css';

interface IExchangeInputProps {
    label: string;
    value: number|string;
    disabled?: boolean;
}
export type ExchangeInputProps = IExchangeInputProps;

export default function ExchangeInput (props: ExchangeInputProps) {
    const setExchangeValue = React.useContext(ExchangeContext);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (setExchangeValue) {
            setExchangeValue(Number(event.target.value));
        }
    };

    return (
        <form noValidate autoComplete="off" className="textInputContainer">
            <TextField
                className="textInput"
                id="standard-name"
                type="number"
                margin="normal"
                disabled={props.disabled}
                label={props.label}
                value={props.value}
                onChange={handleChange}
            />
        </form>
    );
}