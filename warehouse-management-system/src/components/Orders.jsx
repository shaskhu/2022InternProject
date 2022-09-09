import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { Order, LineItem } from '../models';
import { Card } from '@aws-amplify/ui-react';

export default function Orders() {
	const [allOrders, setOrders] = useState([]);
	const [empty, setEmpty] = useState(false);


	useEffect(() => {
		const ordersSubscription = DataStore.observeQuery(Order).subscribe(msg => {
			console.log('msg', msg);
			setOrders(msg.items);

			if (msg.items.length < 1) {
				setEmpty(true);
			} else {
				setEmpty(false);
			}
		});

		const lineItemsSubscription = DataStore.observeQuery(LineItem).subscribe(li => {
			console.log("lineItems", li);
// TODO: use LineItem data
		})



		return () => {
			ordersSubscription.unsubscribe();
			lineItemsSubscription.unsubscribe();
		};
	}, []);



	return (
		<div>
			{!empty &&
				allOrders.map(order => (
					<Card key={order.id} variation="outlined">
						<h1>Order ID: {order.id}</h1>
						<Card key={order.id} variation="outlined">
							<Card key={order.customer.id} variation="outlined">
								<h2>Customer:</h2>
								<p>{order.customer.name}</p>
								<p>{order.customer.email}</p>
							</Card>
							<div key={order.customer.name}>
								<h2>Order details:</h2>
								{order.lineItems?.map(lineItem => {
									return (
										<Card key={lineItem.id} variation="outlined">
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
				))}
			{empty && <h1>No orders!</h1>}
		</div>
	);
}
