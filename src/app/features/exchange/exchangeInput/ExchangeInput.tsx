import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { ExchangeContext } from '../ExchangeContainer';
import { EXCHANGE_VALUE } from '../../../labels';
import './ExchangeInput.css';

interface IExchangeInputProps {
    value: number;
}
export type ExchangeInputProps = IExchangeInputProps;

export default function ExchangeInput (props: ExchangeInputProps) {
    const setExchangeValue = React.useContext(ExchangeContext);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExchangeValue(Number(event.target.value));
      };

    return (
        <form noValidate autoComplete="off" className="textInputContainer">
            <TextField
                className="textInput"
                id="standard-name"
                label={EXCHANGE_VALUE}
                value={props.value}
                onChange={handleChange}
                margin="normal"
            />
        </form>
    );
}