import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import {
	Order,
	LineItem,
	Product,
	FulfillmentStatus,
	Customer,
} from '../models';

function ProductItem({ res, updateProduct }) {
	const [value, setValue] = useState('');

	const handleValue = (e) => {
		setValue(e.target.value);
	};

	return (
		<div key={res}>
			<div key={res.id}>
				<p name="prodname">{res.name}</p>
				<p name="price">Price: ${res.msrpUSD}</p>
				<div key={res.name}>
					Quantity:
					<select value={value} onChange={handleValue}>
						{res.inventoryCount.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
				<button type="button" onClick={() => updateProduct(res, value)}>
					Add Product
				</button>
			</div>
		</div>
	);
}

///////////////////////////////
/* Main function begins here */
///////////////////////////////

// Feature 2A - Order information management
export default function OrderForm({
	customers,
	prods,
	clearOrderForm,
	updateProductData,
}) {
	const [selectCustomer, setValueCust] = useState('');
	const [lineItems, setLineItems] = useState([]);
	const [enableSubmit, setEnableSubmit] = useState(false);
	const [displayProducts, setProducts] = useState([]);
	const [cart, setCart] = useState([]);
	const [displayCart, setDisplayCart] = useState(false);
	const [isProducts, setIsProducts] = useState(false);
	const [inventory, setInventory] = useState('');

	useEffect(() => {
		if (prods[0] === undefined) {
			setProducts([]);
			setIsProducts(true);
		} else {
			setProducts(prods);
			setIsProducts(false);
		}

		console.log('setting initial products');
	}, [prods]);

	const handleSubmit = (event) => {
		event.preventDefault();
		addOrder();
		clearOrderForm(true);
	};

	// Feature 2C
	async function addOrder() {
		const customer = await DataStore.query(Customer, selectCustomer);

		console.log('customer queried within addOrder', customer);

		if (!customer) return;
		console.log('lineitems', lineItems);

		const order = await DataStore.save(
			new Order({
				customer: customer,
				date: new Date().toDateString(),
				lineItems: lineItems,
				fulfillmentStatus: FulfillmentStatus.NOT_FULFILLED,
			})
		);
		console.log('new order created', order);

		for (let i = 0; i < lineItems.length; i++) {
			const update = await DataStore.save(
				LineItem.copyOf(lineItems[i], (updated) => {
					updated.order = order;
				})
			);
			console.log('example lineItem', update);
		}
	}

	async function updateProduct(res, q) {
		console.log('quantity: ' + q);

		let name = res.name;
		let inv = res.inventoryCount.length;

		let newInv = inv - q;
		setInventory(q);

		const oldProduct = await DataStore.query(Product, (c) =>
			c.name('eq', name)
		);
		const newProduct = await DataStore.save(
			Product.copyOf(oldProduct[0], (updated) => {
				updated.inventoryCount = Array.from(Array(newInv).keys());
			})
		);

		console.log('updated product: ', newProduct);
		console.log('old product', oldProduct);
		const li = await DataStore.save(
			new LineItem({
				product: newProduct,
				agreedUnitPrice: newProduct.msrpUSD,
				quantity: Number(q),
			})
		);

		setLineItems((lineItems) => [...lineItems, li]);

		setCart((cart) => [...cart, newProduct]);
		setDisplayCart(true);
	}

	async function removeFromCart(c, index) {
		const product = await DataStore.query(Product, c.id);
		console.log('product to update', product);
		const newInv = product.inventoryCount.length + Number(inventory);

		console.log('new inv ' + newInv);
		const result = await DataStore.save(
			Product.copyOf(product, (updated) => {
				updated.inventoryCount = Array.from(Array(newInv).keys());
			})
		);
		console.log('Update product quantity response:', result);
		const newItems = lineItems.filter((l) => l.product.id !== product.id);
		setLineItems(newItems);
		const newCart = cart.filter((p) => p.id !== product.id);
		console.log('new cart', newCart);
		setCart(newCart);
	}

	// handler for react-select for the customers
	const handleSelectCustomer = (e) => {
		setValueCust(e.target.value);
		setEnableSubmit(true);
	};

	return (
		<div key={enableSubmit}>
			<form id="add-app" onSubmit={handleSubmit}>
				<br />
				<select
					className="form-control"
					value={selectCustomer}
					onChange={handleSelectCustomer}
				>
					<option key={'select customer'} value="choose">
						--Select Customer--
					</option>
					{customers.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name} - {c.phoneNumber}
						</option>
					))}
				</select>
				{!isProducts &&
					displayProducts.map((res) => (
						<ProductItem
							key={res.msrpUSD}
							res={res}
							updateProduct={updateProduct}
						/>
					))}
				<br />

				<button type="submit" disabled={!enableSubmit}>
					Add New Order
				</button>
			</form>
			<h2>Shopping Cart: </h2>
			{displayCart &&
				cart.map((c, index) => (
					<div key={index}>
						<p>{c.name}</p>
						<p>{c.msrpUSD}</p>
						<button onClick={() => removeFromCart(c, index)}>Remove</button>
					</div>
				))}
		</div>
	);
}
