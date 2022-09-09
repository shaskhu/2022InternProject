import { Link } from 'react-router-dom';
import { Card, Divider, Flex, View } from '@aws-amplify/ui-react';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import {
	AccountRepresentative,
	Customer,
	Order,
	LineItem,
	Product,
} from '../models';

const Nav = () => {
	async function queryAll() {
		const accountRepresentatives = await DataStore.query(AccountRepresentative);
		console.log('accountRepresentatives', accountRepresentatives);
		const customers = await DataStore.query(Customer);
		console.log('customers', customers);
		const orders = await DataStore.query(Order);
		console.log('orders', orders);
		const lineItems = await DataStore.query(LineItem);
		console.log('lineItems', lineItems);
		const products = await DataStore.query(Product);
		console.log('products', products);
		
		
	}

	async function deleteAll() {
		await DataStore.delete(AccountRepresentative, Predicates.ALL);
		await DataStore.delete(Customer, Predicates.ALL);
		await DataStore.delete(Order, Predicates.ALL);
		await DataStore.delete(LineItem, Predicates.ALL);
		await DataStore.delete(Product, Predicates.ALL);
	}

	return (
		<View position={'sticky'} top={0}>
			<Card width={'100%'} variation={'elevated'}>
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Flex alignItems="center" justifyContent="center">
						<Link to="/">Home</Link>
						<Divider orientation="vertical" />
						<Link to="/customers">Customers</Link>
						<Divider orientation="vertical" />
						<Link to="/orders">Orders</Link>
						<Divider orientation="vertical" />
						<Link to="/inventory">Inventory</Link>
						<Card variation="outlined">
							<button onClick={queryAll}>Query All</button>
							<button onClick={deleteAll}>Delete All</button>
						</Card>
					</Flex>
					<Divider orientation="vertical" />
					{/* TODO: add signout after adding auth */}
					{/* <AmplifySignOut /> */}
				</Flex>
			</Card>
		</View>
	);
};

export default Nav;
