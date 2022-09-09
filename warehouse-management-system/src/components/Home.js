import '../App.css';
import React, { useState, useEffect } from 'react';
import { DataStore, Predicates } from 'aws-amplify';
import { Customer, Product } from '../models';
import CustomerForm from './CustomerForm';
import OrderForm from './OrderForm';
import { Card } from '@aws-amplify/ui-react';
import products from '../data';
import { ulid } from 'ulid';

function App() {
	const [formState, setFormState] = useState('');
	const [showCustomerForm, setShowCustomerForm] = useState(false);
	const [showOrderForm, setShowOrderForm] = useState(false);
	const [showSearchResults, setResults] = useState(false);
	const [customerSearchResults, setCustomerSearchResults] = useState([]);
	const [allCustomers, setCustomers] = useState([]);
	const [allProducts, setProducts] = useState([]);
	const [successCustomer, setSuccessCustomer] = useState(false);
	const [successOrder, setSuccessOrder] = useState(false);

	useEffect(() => {
		const subscription = DataStore.observeQuery(Customer).subscribe((msg) => {
			console.log('msg', msg);
			setCustomers(msg.items);
		});
		const subscription2 = DataStore.observeQuery(Product).subscribe((m) => {
			console.log('prod msg', m);
			setProducts(m.items);
		});

		return () => {
			subscription.unsubscribe();
			subscription2.unsubscribe();
		};
	}, []);

	// state handlers
	const showCustomer = () => {
		setShowCustomerForm(!showCustomerForm);
		if (showOrderForm === true) {
			setShowOrderForm(!showOrderForm);
		}
		if (showSearchResults === true) {
			setResults(!showSearchResults);
		}
	};

	const showOrder = async () => {
		setShowOrderForm(!showOrderForm);
		if (showCustomerForm === true) {
			setShowCustomerForm(!showCustomerForm);
		}

		// all customers queried for the customer selection when creating an order
		const c = await DataStore.query(Customer);
		setCustomers(c);
	};

	// Features 1A, F; 2A, B
	async function handleSearch() {
		setResults(!showSearchResults);
		if (showCustomerForm === true) {
			setShowCustomerForm(!showCustomerForm);
		}
		const customers = await DataStore.query(Customer, (c) =>
			c.name('eq', formState)
		);
		console.log('query: ', customers);
		setCustomerSearchResults(customers);

		setFormState('');
	}

	// Features 1D, E
	async function deleteCust(res) {
		const customer = await DataStore.query(Customer, res.id);
		console.log('customer to delete:', customer);

		const result = await DataStore.delete(customer);
		console.log('Delete response:', result);
		const customers = await DataStore.query(Customer, (c) =>
			c.name('eq', res.name)
		);

		setCustomerSearchResults(customers);
	}

	async function populateProducts() {
		console.log('before populate products', allProducts);
		const p1 = await DataStore.save(
			new Product({
				id: ulid(),
				name: products[0].name,
				msrpUSD: products[0].msrpUSD,
				inventoryCount: products[0].inventoryCount,
			})
		);
		const p2 = await DataStore.save(
			new Product({
				id: ulid(),
				name: products[1].name,
				msrpUSD: products[1].msrpUSD,
				inventoryCount: products[1].inventoryCount,
			})
		);
		const p3 = await DataStore.save(
			new Product({
				id: ulid(),
				name: products[2].name,
				msrpUSD: products[2].msrpUSD,
				inventoryCount: products[2].inventoryCount,
			})
		);
		const arr = [];

		arr.push(p1);
		arr.push(p2);
		arr.push(p3);
		setProducts(arr);
		console.log('populated products:', arr);
	}

    // TODO: remove this function, and refactor how we're querying Products, or rename (`getProducts`)
	async function updateProductData() {
		const arr = await DataStore.query(Product);
		setProducts(arr);
		console.log('prods now', allProducts);
	}

	async function deleteProducts() {
		const deleted = await DataStore.delete(Product, Predicates.ALL);
		console.log('deleted all', deleted);
		setProducts([]);
	}

	function clearCustomerForm(done) {
		if (done) {
			setShowCustomerForm(false);
			setSuccessCustomer(true);
			setSuccessOrder(false);
		}
	}

	function clearOrderForm(done) {
		if (done) {
			setShowOrderForm(false);
			setSuccessOrder(true);
			setSuccessCustomer(false);
		}
	}

	return (
		<div className="App">
			<h1 className="text-center mb-4">Warehouse Manager</h1>
			<button onClick={populateProducts}>Populate Products</button>
			<button onClick={deleteProducts}>Delete Products</button>
			<br />
			<p>Operations:</p>
			<button onClick={showCustomer}>Add Customer</button>
			<button onClick={showOrder}>Add Order</button>
			<br />
			<input
				onChange={(event) => setFormState(event.target.value)}
				value={formState}
				placeholder="Search customers..."
			/>
			<button onClick={handleSearch}>Search</button>

			<div>
				{showCustomerForm && (
					<CustomerForm clearCustomerForm={clearCustomerForm} />
				)}
			</div>
			<div>
				{showOrderForm && (
					<OrderForm
						customers={allCustomers}
						prods={allProducts}
						clearOrderForm={clearOrderForm}
						updateProductData={updateProductData}
					/>
				)}
			</div>

			<div>
				{showSearchResults && (
					<div>
						{customerSearchResults.map((res) => (
							<Card key={res.id} variation="outlined">
								<h2>{res.name}</h2>
								<p>Phone Number: {res.phoneNumber}</p>
								<p>Email Address: {res.email}</p>
								{/* <h3>Orders: </h3>
								<div>
									{res.orders?.map((order, index) => {
										return (
											<div key={order.id}>
												<h4>Order {index + 1}: </h4>
												{order.lineItems.map((lineItem) => {
													return (
														<div key={lineItem.id}>
															<p>Product: {lineItem.product.name}</p>
															<p>Quantity: {lineItem.quantity}</p>
														</div>
													);
												})}
											</div>
										);
									})}
								</div> */}
								<button onClick={() => deleteCust(res)}>Delete Customer</button>
							</Card>
						))}
					</div>
				)}

				{successCustomer && <h2>Successfully added customer!</h2>}
				{successOrder && <h2>Successfully added order!</h2>}
			</div>
		</div>
	);
}

export default App;
