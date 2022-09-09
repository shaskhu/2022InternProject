import React, { useEffect, useState } from 'react';
import { Customer } from '../models';
import { DataStore } from 'aws-amplify';
import { Card } from '@aws-amplify/ui-react';

export default function Customers() {
	const [results, setResults] = useState([]);
	const [empty, setEmpty] = useState(false);

	useEffect(() => {
		const subscription = DataStore.observeQuery(Customer).subscribe((msg) => {
			console.log('msg', msg);
			setResults(msg.items);
			if (msg.items.length < 1) {
				setEmpty(true);
			} else {
				setEmpty(false);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	async function deleteCust(res) {
		const result = await DataStore.delete(Customer, res.id);
		console.log('Delete response:', result);
		await DataStore.query(Customer);
	}

	return (
		<div>
			{!empty &&
				results.map((res) => (
					<Card key={res.id} variation="outlined">
						<h2>{res.name}</h2>
						<p>Phone Number: {res.phoneNumber}</p>
						<p>Email Address: {res.email}</p>
						<button onClick={() => deleteCust(res)}>Delete Customer</button>
						<div>
							<br />
						</div>
					</Card>
				))}

			{empty && <h1>No customers!</h1>}
		</div>
	);
}
