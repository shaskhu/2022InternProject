import React, { useEffect, useState } from 'react';
import { Card } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
import { LineItem } from '../models';

export default function OrderItem({ order, allLineItems }) {
	const [lineItems, setLineItems] = useState([]);

	useEffect(() => {
		const sub = DataStore.observeQuery(
			LineItem
			//, (line) =>
			//line.order('eq', order)
		).subscribe((l) => {
			setLineItems(l.items);
			console.log('setting', l);
		});
		console.log('updated li', lineItems);

		return () => {
			sub.unsubscribe();
		};
	}, []);

	// const getItems = (order) => {
	// 	for (let i in allLineItems) {
	// 		if (
	// 			allLineItems[i].order?.id === order.id &&
	// 			!lineItems.includes(allLineItems[i])
	// 		) {
	// 			console.log('all line items of ' + i + ': ', allLineItems[i]);
	// 			setLineItems((lineItems) => [...lineItems, allLineItems[i]]);
	// 		}
	// 	}
	// };

	return (
		<div>
			<Card key={order.id} variation="outlined">
				<h1>Order ID: {order.id}</h1>
				<Card key={order.totalPrice} variation="outlined">
					<Card key={order.customer.id} variation="outlined">
						<h2>Customer:</h2>
						<p>{order.customer.name}</p>
						<p>{order.customer.email}</p>
					</Card>
					<div key={order.customer.name}>
						<h2>Order details:</h2>
						{allLineItems.map((lineItem) => {
							return (
								<Card key={lineItem.product.id} variation="outlined">
									<h3>Product: </h3>
									<p>
										{lineItem.product.name} - ${lineItem.agreedUnitPrice}
									</p>
									<h4>Quantity: </h4>
									<p>{lineItem.quantity}</p>
								</Card>
							);
						})}
					</div>
				</Card>
			</Card>
		</div>
	);
}
