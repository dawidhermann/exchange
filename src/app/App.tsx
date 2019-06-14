import * as React from "react";
import ExchangeContainer from "./features/exchange/ExchangeContainer";

export interface IAppProps {}

export default function IApp(props: IAppProps) {
  return <ExchangeContainer />;
}