import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { Product } from '../models';
import { Card } from '@aws-amplify/ui-react';

export default function Inventory() {
	const [results, setResults] = useState([]);

	useEffect(() => {
		const sub = DataStore.observeQuery(Product).subscribe((msg) => {
			console.log('inventory observe', msg);
			setResults(msg.items);
			console.log(results);
		});
		return () => {
			sub.unsubscribe();
		};
	}, []);

	return (
		<div>
			{results.map((res) => (
				<Card key={res.id} variation="outlined">
					<h2>{res.name}</h2>
					<h3>{res.inventoryCount.length} units left</h3>
				</Card>
			))}
		</div>
	);
}
