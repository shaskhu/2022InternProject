import React from 'react';
import { DataStore } from 'aws-amplify';
import { Customer } from '../models';

// Feature 1 - Customer information management
export default function CustomerForm({ clearCustomerForm }) {
	// handler for customer form submit

	// Feature 1B, C
	async function createCustomer(event) {
		event.preventDefault();
		let cName = event.target.customerName.value;
		let emailAdd = event.target.emailAdd.value;
		let number = event.target.phoneNumber.value;
		const customer = await DataStore.save(
			new Customer({
				id: emailAdd,
				name: cName,
				phoneNumber: number,
				email: emailAdd,
			})
		);

		console.log('customer created:', customer);
		clearCustomerForm(true);
	}

	return (
		<div>
			<form id="add-app" onSubmit={createCustomer}>
				<label>Customer Name : </label>
				<input name="customerName" />
				<br />
				<label> Phone Number : </label>
				<input name="phoneNumber" />
				<br />
				<label> Email Address : </label>
				<input name="emailAdd" />
				<br />
				<button>Add New Customer</button>
			</form>
		</div>
	);
}
