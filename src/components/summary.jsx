import React from "react";
import { toast } from 'materialize-css';

import * as Currency from '../const/currency';


export class Summary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			assets: JSON.parse(localStorage.getItem('assets')) || Currency.defaultUserAsset,
			currencies: ['BTC', 'ETH'],
		};
	}

	transaction = (symbol, amount) => {
		let assets = this.state.assets;
		let USDAmount = assets.USD - this.props.priceData[symbol].USD * amount;
		let symbolAmount = (assets[symbol] || 0) + amount;
		if (USDAmount >= 0 && symbolAmount >= 0) {
			assets.USD = USDAmount;
			assets[symbol] = symbolAmount;
			this.setState({assets: assets});
			localStorage.setItem('assets', JSON.stringify(assets));
			return true;
		} else {
			return false;
		}
	};

	render() {
		return (
			<table>
				<thead>
				<tr>
					<th>Currency name</th>
					<th>Current Price</th>
					<th>Quantity</th>
					<th>Value</th>
					<th>You have: ${this.state.assets.USD.toPrecision(7)}</th>
				</tr>
				</thead>

				<tbody>
					{Currency.list.map((symbol) => (
						<tr key={symbol}>
							<td>{symbol}</td>
							<td>{this.props.priceData ? this.props.priceData[symbol].USD : 'N/A'}</td>
							<td>{(this.state.assets[symbol] || 0).toPrecision(7)}</td>
							<td>{this.props.priceData ? (this.props.priceData[symbol].USD * (this.state.assets[symbol] || 0)).toPrecision(7) : 'N/A'}</td>
							<td>
								<input ref={symbol} type="number"/>
								<a onClick={() => {
									if (parseFloat(this.refs[symbol].value) > 0) {
										if (this.transaction(symbol, parseFloat(this.refs[symbol].value))) {
											toast(`Bought ${this.refs[symbol].value} ${symbol}`, 3000)
										} else {
											toast(`Not sufficient funds!`, 3000)
										}

									}
								}}>Buy</a>
								<a onClick={() => {
									if (parseFloat(this.refs[symbol].value) > 0) {
										if (this.transaction(symbol, -parseFloat(this.refs[symbol].value))) {
											toast(`Sould ${this.refs[symbol].value} ${symbol}`, 3000)
										} else {
											toast(`Not sufficient ${symbol}!`, 3000)
										}

									}
								}}>Sell</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		)
	}
}