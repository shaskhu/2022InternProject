import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { Order, LineItem } from '../models';
import OrderItem from './OrderItem';

export default function Orders() {
	const [allOrders, setOrders] = useState([]);
	const [empty, setEmpty] = useState(false);
	const [allLineItems, setAllLineItems] = useState([]);

	useEffect(() => {
		const sub = DataStore.observeQuery(LineItem).subscribe((li) => {
			console.log('lineItems msg', li);
			setAllLineItems(li.items);
		});
		const subscription = DataStore.observeQuery(Order).subscribe((msg) => {
			console.log('msg', msg);
			setOrders(msg.items);

			if (msg.items.length < 1) {
				setEmpty(true);
			} else {
				setEmpty(false);
			}
		});

		return () => {
			subscription.unsubscribe();
			sub.unsubscribe();
		};
	}, []);

	return (
		<div>
			{!empty &&
				allOrders.map((order) => (
					<OrderItem order={order} allLineItems={allLineItems} />
				))}
			{empty && <h1>No orders!</h1>}
		</div>
	);
}
